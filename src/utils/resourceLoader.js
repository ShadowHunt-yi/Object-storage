/**
 * 资源预加载工具
 * 用于优化关键资源的加载顺序和时机
 */

class ResourceLoader {
    constructor() {
        this.loadedResources = new Set()
        this.loadingPromises = new Map()
    }

    /**
     * 预加载关键CSS资源
     */
    async preloadCriticalCSS() {
        const criticalCSS = [
            '/css/chunk-vendors.css',
            '/css/app.css'
        ]

        const promises = criticalCSS.map(href => this.preloadCSS(href))
        await Promise.allSettled(promises)
    }

    /**
     * 预加载CSS文件
     */
    preloadCSS(href) {
        if (this.loadedResources.has(href)) {
            return Promise.resolve()
        }

        if (this.loadingPromises.has(href)) {
            return this.loadingPromises.get(href)
        }

        const promise = new Promise((resolve, reject) => {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'style'
            link.href = href
            link.onload = () => {
                this.loadedResources.add(href)
                resolve()
            }
            link.onerror = reject
            document.head.appendChild(link)

            // 立即应用样式
            setTimeout(() => {
                link.rel = 'stylesheet'
            }, 0)
        })

        this.loadingPromises.set(href, promise)
        return promise
    }

    /**
     * 预加载JavaScript文件
     */
    preloadJS(src) {
        if (this.loadedResources.has(src)) {
            return Promise.resolve()
        }

        if (this.loadingPromises.has(src)) {
            return this.loadingPromises.get(src)
        }

        const promise = new Promise((resolve, reject) => {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'script'
            link.href = src
            link.onload = () => {
                this.loadedResources.add(src)
                resolve()
            }
            link.onerror = reject
            document.head.appendChild(link)
        })

        this.loadingPromises.set(src, promise)
        return promise
    }

    /**
     * 智能预取下一页面资源
     */
    prefetchRouteResources(routeName) {
        const routeResourceMap = {
            'upload': ['/js/chunk-image.js'],
            'console': ['/js/chunk-charts.js'],
            'filelist': ['/js/chunk-utils.js']
        }

        const resources = routeResourceMap[routeName] || []
        resources.forEach(resource => {
            this.prefetchResource(resource)
        })
    }

    /**
     * 预取资源
     */
    prefetchResource(href) {
        if (this.loadedResources.has(href)) {
            return
        }

        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = href
        document.head.appendChild(link)
    }

    /**
     * 检查网络状况并调整加载策略
     */
    adaptToNetworkCondition() {
        if ('connection' in navigator) {
            const connection = navigator.connection
            const effectiveType = connection.effectiveType

            // 在慢速网络下减少预取
            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                return 'conservative'
            } else if (effectiveType === '3g') {
                return 'moderate'
            } else {
                return 'aggressive'
            }
        }
        return 'moderate'
    }

    /**
     * 延迟加载非关键资源
     */
    async loadNonCriticalResources() {
        const strategy = this.adaptToNetworkCondition()

        if (strategy === 'conservative') {
            // 慢速网络，只加载必要资源
            return
        }

        // 延迟加载字体图标
        setTimeout(() => {
            this.preloadCSS('/css/iconfont.css')
            this.preloadCSS('/css/font-awesome.min.css')
        }, 1000)

        // 根据网络状况决定是否预取其他资源
        if (strategy === 'aggressive') {
            setTimeout(() => {
                this.prefetchRouteResources('upload')
                this.prefetchRouteResources('console')
            }, 2000)
        }
    }
}

// 创建全局实例
const resourceLoader = new ResourceLoader()

export default resourceLoader 