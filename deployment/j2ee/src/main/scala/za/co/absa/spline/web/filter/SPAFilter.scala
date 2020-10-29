/*
 * Copyright 2020 ABSA Group Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package za.co.absa.spline.web.filter

import javax.servlet._
import javax.servlet.http.{HttpServletRequest, HttpServletResponse}
import org.apache.commons.lang.StringUtils.substringBefore
import org.json4s.DefaultFormats
import org.json4s.Extraction.decompose
import za.co.absa.commons.config.ConfigurationImplicits.ConfigurationRequiredWrapper
import za.co.absa.spline.common.config.DefaultConfigurationStack
import za.co.absa.spline.common.io.OutputCapturingHttpResponseWrapper
import za.co.absa.spline.web.filter.SPAFilter._

import scala.collection.JavaConverters._


object SPAFilter {
    val ConsumerUrlUIConfKey = "splineConsumerApiUrl"
    val HeaderAccept = "Accept"
    val MimeTextHtml = "text/html"

    object Param {
        val BaseHrefPlaceholder = "baseHrefPlaceholder"
        val AppPrefix = "appPrefix"
        val IndexPath = "indexPath"
        val AssetsPath = "assetsPath"
        val ConfigPath = "configPath"
    }

    private def isTextHtmlAccepted(acceptHeaderValues: Seq[String]) = {
        val acceptMimes = acceptHeaderValues.flatMap(parseAcceptHeader)
        acceptMimes.isEmpty || acceptMimes.contains(MimeTextHtml)
    }

    private def parseAcceptHeader(accept: String) =
        for {
            s <- accept.split("\\s*,\\s*")
            if s.nonEmpty
        } yield substringBefore(s, ";").toLowerCase
}

class SPAFilter extends Filter {

    import org.json4s.native.JsonMethods._

    implicit val formats: DefaultFormats = DefaultFormats

    private val consumerUrl = (new DefaultConfigurationStack).getRequiredString("spline.consumer.url")

    private var baseHrefPlaceholder: String = _
    private var appBase: String = _
    private var indexPath: String = _
    private var assetsPath: String = _
    private var configPath: String = _

    override def destroy(): Unit = {}

    override def init(filterConfig: FilterConfig): Unit = {
        baseHrefPlaceholder = filterConfig.getInitParameter(Param.BaseHrefPlaceholder)
        appBase = filterConfig.getInitParameter(Param.AppPrefix)
        indexPath = filterConfig.getInitParameter(Param.IndexPath)
        assetsPath = filterConfig.getInitParameter(Param.AssetsPath)
        configPath = filterConfig.getInitParameter(Param.ConfigPath)
    }

    override def doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain): Unit = {
        val httpReq = request.asInstanceOf[HttpServletRequest]
        val httpRes = response.asInstanceOf[HttpServletResponse]
        if (isSAPConfig(httpReq)) handleSPAConfig(httpReq, httpRes, chain)
        else if (isSAPRouting(httpReq)) handleSPARouting(httpReq, httpRes)
        else chain.doFilter(request, response)
    }

    private def isSAPConfig(req: HttpServletRequest) = req.getServletPath == configPath

    private def isSAPRouting(req: HttpServletRequest) = {
        val reqPath = req.getServletPath
        (reqPath.startsWith(appBase)
            && !reqPath.startsWith(assetsPath)
            && isTextHtmlAccepted(req.getHeaders(HeaderAccept).asScala.toSeq))
    }

    private def handleSPAConfig(req: HttpServletRequest, res: HttpServletResponse, chain: FilterChain): Unit = {
        val responseWrapper = new OutputCapturingHttpResponseWrapper(res)
        chain.doFilter(req, responseWrapper)

        val originalJsonString = responseWrapper.getContentAsString
        val updatedJsonString =
            if (responseWrapper.getStatus == 200 && originalJsonString.nonEmpty)
                compact(render(decompose(
                    parse(originalJsonString)
                        .extract[Map[String, Any]]
                        .updated(ConsumerUrlUIConfKey, consumerUrl)
                )))
            else originalJsonString

        res.setContentLength(updatedJsonString.length)
        res.getWriter.write(updatedJsonString)
    }

    private def handleSPARouting(req: HttpServletRequest, res: HttpServletResponse): Unit = {
        val responseWrapper = new OutputCapturingHttpResponseWrapper(res)
        val dispatcher = req.getRequestDispatcher(indexPath)
        dispatcher.include(req, responseWrapper)
        val baseHref = s"${req.getContextPath}$appBase"
        val rawHtml = responseWrapper.getContentAsString
        val fixedHtml = rawHtml.replace(baseHrefPlaceholder, baseHref)
        res.getWriter.write(fixedHtml)
    }
}
