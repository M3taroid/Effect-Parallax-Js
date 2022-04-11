const offsetTop = (el, acc=0) => {
    if(el.offsetParent) {
        return offsetTop(el.offsetParent, acc + el.offsetTop)
    }
    return acc + el.offsetTop
}


class Parallax {

    constructor (el) {
        this.el = el
        this.options = this.parseAttributes()
        this.elY = offsetTop(this.el) + this.el.offsetHeight / 2
        this.onScroll = this.onScroll.bind(this)
        this.onIntersection = this.onIntersection.bind(this)
        const observer = new IntersectionObserver(this.onIntersection)

        observer.observe(el)
        this.onScroll()
    }

    parseAttributes () {
        const defaults = {y: 0.2, variable: false}
        if (this.el.dataset.parallax.startsWith('{')) return {...defaults, ...JSON.parse(this.el.dataset.parallax)}
        return {...defaults, y: parseFloat(this.el.dataset.parallax)}
    }

    onIntersection (entries) {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                document.addEventListener('scroll', this.onScroll)
                this.elY = offsetTop(this.el) + this.el.offsetHeight / 2
            }
            else document.removeEventListener('scroll', this.onScroll)
        }
    }

    onScroll () {
        window.requestAnimationFrame(() => {
            const screenY = window.scrollY + window.innerHeight / 2
            const diffY = this.elY - screenY
            const translateY = diffY * -1 * this.options.y
            if(this.options.variable){
                this.el.style.setProperty('--parallaxY', `${translateY}px`)
            }else{
                let transform = `translateY(${translateY}px)`
                if(this.options.r) transform += ` rotate(${diffY * this.options.r}deg)`
                this.el.style.setProperty('transform', transform)
            }
            
        })
        
    }
    

    static bind () {
        return Array.from(document.querySelectorAll("[data-parallax]")).map(el => {
            return new Parallax(el)
        })
    }
}

Parallax.bind()
