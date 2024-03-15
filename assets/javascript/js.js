const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playerbtn = $('.player')
const cd = $(".cd")
const playlist = $('.playlist')
const heading = $('header h2')
const thumbCd =$('.cd-thumb')
const audioCd = $('#audio')
const playbtn = $('.btn-toggle-play')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')


const app = {
    currentIndex:0,
    isPlaying:false,
    isRandom:false,
    isRepeat :false,
    songs:[
        {
            name:'Nevada',
            singer: 'Vicetone',
            path:'./assets/music/Nevada.mp3',
            image:'./assets/img/Nevada.jpg'
        },
        {
            name:'Making My Way',
            singer: 'Sơn Tùng-MTP',
            path:'./assets/music/MakingMyWay.mp3',
            image:'./assets/img/Making_my_way.jpg'
        },
        {
            name:'DaDaDa',
            singer: 'Tanir & Tyomcha',
            path:'./assets/music/DaDaDa.mp3',
            image:'./assets/img/da_da_da.jpg'
        },
        {
            name:'Quẻ bói',
            singer: 'Thôi Tử Cách',
            path:'./assets/music/QueBoi.mp3',
            image:'./assets/img/que_boi.jpg'
        },
        {
            name:'Nevada',
            singer: 'Vicetone',
            path:'./assets/music/Nevada.mp3',
            image:'./assets/img/Nevada.jpg'
        },
        {
            name:'Making My Way',
            singer: 'Sơn Tùng-MTP',
            path:'./assets/music/MakingMyWay.mp3',
            image:'./assets/img/Making_my_way.jpg'
        },
        {
            name:'Quẻ bói',
            singer: 'Thôi Tử Cách',
            path:'./assets/music/QueBoi.mp3',
            image:'./assets/img/que_boi.jpg'
        },
        {
            name:'Xomu',
            singer: 'Lanterns',
            path:'./assets/music/Xomu.mp3',
            image:'./assets/img/Xommu.jpg'
        }
    ],
    render:function(){
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song ${index ===this.currentIndex ?'active':''}" data-index="${index}">
            <div class="thumb" style="background-image: url(${song.image});">
            </div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer} </p>
        </div>
        <div class="option">
            <i class="fa-solid fa-ellipsis"></i>
        </div>
    </div>
                    `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties : function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth


        // Xử lý CD quay /dừng
        const cdThumbAnimete = thumbCd.animate([
            { transform:'rotate(360deg)'}
        ],{
            duration:10000,// 10seconds
            iterations:Infinity
        })
        cdThumbAnimete.pause()
        // lấy sự kiện phóng to/ thu nhỏ
        document.onscroll = function(){
            const scrollTop = window.scrollY|| document.documentElement.scrollTop
            const newcdWidth = cdWidth - scrollTop
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0
            cd.style.opacity = newcdWidth / cdWidth         
        }
        // lấy sự kiện onlick play
        playbtn.onclick = function(){
            if(_this.isPlaying){
                audioCd.pause()

            }else{
                audioCd.play()

            }
        }
        // khi song được play
        audioCd.onplay = function(){
            _this.isPlaying = true
            playerbtn.classList.add('playing')
            cdThumbAnimete.play()
           
        }
        // khi song được pause
        audioCd.onpause = function(){
            _this.isPlaying = false
            playerbtn.classList.remove('playing')
           cdThumbAnimete.pause()
        }
        // tiến độ bài hát chạy
        audioCd.ontimeupdate = function(){
          if(audioCd.duration){
            const progressPercent = Math.floor(audioCd.currentTime /audioCd.duration * 100)
            progress.value = progressPercent
          }
        }
        // xử lý khi tua song
        progress.onchange = function(e){
            const seekTime = audioCd.duration / 100 * e.target.value
            audioCd.currentTime = seekTime
        }
        // khi next bài hát
        btnNext.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
            _this.nextSong()

            }
            audioCd.play()
            _this.render()
        }
        //  khi prev bài hát
        btnPrev.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
            _this.prevSong()

            }
            audioCd.play()
            _this.render()
        }
        //  khi random bài hát 
        btnRandom.onclick = function(e){
          _this.isRandom =!_this.isRandom
          btnRandom.classList.toggle('active',_this.isRandom)
        }
        // xử lý repeat bài hát
        btnRepeat.onclick = function(e){
            _this.isRepeat =! _this.isRepeat
            btnRepeat.classList.toggle('active',_this.isRepeat)
        }
        //  xử lý tự next bài hát
        audioCd.onended = function(){
            if(_this.isRepeat){
                audioCd.play()
            }else{
            btnNext.click()
            }
        }
        // Lắng nghe hành vi click vào
        playlist.onclick = function(e){
            const nodeSong =e.target.closest('.song:not(.active)')
            if(nodeSong || e.target.closest('.option')){
                if(nodeSong){
                    _this.currentIndex = Number(nodeSong.dataset.index)
                    _this.loadcurrentSong()
                    _this.render()
                    audioCd.play()
                }
            }
        }
    },
    loadcurrentSong:function(){
        heading.textContent = this.currentSong.name
        thumbCd.style.backgroundImage = `url('${this.currentSong.image}')`
        audioCd.src = this.currentSong.path 
    },
    // NEXT SONG
    nextSong:function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadcurrentSong()
    },
    // prev Song
    prevSong:function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1 
        }
        this.loadcurrentSong()
    },
    // Random Song
    randomSong:function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        }while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
       this.loadcurrentSong()
        
    },
    start:function(){
        // định nghĩa các thuộc tính của object
        this.defineProperties()
        // loading bài hát
        this.loadcurrentSong()
        //  bắt sự kiện Envent DOM
        this.handleEvents()
        // render ra bài hát
        this.render()
        
    }
}
app.start()