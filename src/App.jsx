import { useState, useRef } from "react"
import YouTube from "react-youtube"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Search, Music2 } from "lucide-react"

function App() {
  const [lyrics, setLyrics] = useState("")
  const [artist, setArtist] = useState("")
  const [song, setSong] = useState("")
  const [songId, setSongId] = useState("")
  const [albumArt, setAlbumArt] = useState(null)
  
  const [isPlaying, setIsPlaying] = useState(false)

  const [inputArtist, setInputArtist] = useState("") 
  const [inputSong, setInputSong] = useState("")
  
  const playerRef = useRef(null)

  const opts = {
    height: '0', 
    width: '0', 
    playerVars: {
      autoplay: 1, 
      playsinline: 1,
      origin: window.location.origin
    }
  }

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    event.target.playVideo();
  }

  const onPlayerStateChange = (event) => {
    setIsPlaying(event.data === 1);
  }

  const fetchLyrics = async(artist, title) => {
    try{
      const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
      const data = await res.json()
      setLyrics(data.lyrics) 
    } catch (err) {
      console.error("Error fetching lyrics")
      setLyrics("Lyrics not found.")
    }
  }

  const fetchVideo = async(query) => {
    try{
      const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query} audio&type=video&maxResults=1&key=${API_KEY}`
      
      const res = await fetch(url)
      const data = await res.json()

      if(data.items.length > 0){
        const videoData = data.items[0];
        setSongId(videoData.id.videoId)
        setAlbumArt(videoData.snippet.thumbnails.high.url)
      }
    }catch(err){
      console.error("Youtube error:", err)
    }
  }

  const findTrackMetaData = async(searchArtist, searchSong) => {
    try{
      const query = `${searchArtist} ${searchSong}`
      const res = await fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=1`)
      const data = await res.json()

      if (data.resultCount > 0){
        const track = data.results[0]
        return{
          validArtist: track.artistName,
          validSong: track.trackName
        }
      }
      return null
    } catch(err) {
      console.error("Metadata Search failed", err)
      return null
    }
  }

  const handleSearch = async (e) => {
    e?.preventDefault()
    setLyrics(""); 
    const metadata = await findTrackMetaData(inputArtist, inputSong)

    let queryArtist = inputArtist
    let querySong = inputSong

    if(metadata){
      queryArtist = metadata.validArtist
      querySong = metadata.validSong
    }

    setArtist(queryArtist)
    setSong(querySong)

    await Promise.all([
      fetchLyrics(queryArtist,querySong),
      fetchVideo(`${queryArtist} ${querySong}`)
    ])
  }

  const togglePlay = (e) => {
    e?.preventDefault()
    if (playerRef.current) {
      isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
    } else {
      console.log("Player not ready yet.")
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-white">
      
      {/*dynamic background layer(album art)*/}
      <div className="fixed inset-0 z-0 bg-neutral-900">
        {albumArt && (
          <motion.div 
            key={albumArt} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img 
              src={albumArt} 
              alt="Background" 
              className="w-full h-full object-cover blur-md opacity-60 scale-110" 
            />
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>
        )}
      </div>

      {/*main content */}
      <div className="flex flex-col items-center md:px-10 px-2 py-10 z-10 relative">
        
        {/*searchbar*/}
        <motion.div 
          initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
          className="w-full max-w-3xl mb-16"
        >
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl transition-all focus-within:bg-white/15 focus-within:border-white/30 hover:bg-white/15">
            <div className="md:pl-4 pl-2 text-white/50">
              <Search size={20} />
            </div>
            
            {/*artist tnput*/}
            <input 
              type="text" placeholder="Artist"
              className="w-full bg-transparent border-none text-white placeholder-white/40 md:px-3 py-3 focus:outline-none font-medium tracking-wide"
              onChange={(e)=> setInputArtist(e.target.value)}
            />
            
            {/* divider */}
            <div className="h-6 w-px bg-white/20"></div>

            {/*song input */}
            <input 
              type="text" placeholder="Song Name"
              className="w-full bg-transparent border-none text-white placeholder-white/40 md:px-3 py-3 focus:outline-none font-medium tracking-wide"
              onChange={(e)=> setInputSong(e.target.value)}
            />

            {/*go button */}
            <button 
              onClick={handleSearch}
              className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition active:scale-95"
            >
              Go
            </button>
          </div>
        </motion.div>

        {/*hidden player*/}
        <div className="absolute top-0 left-0 w-1 h-1 opacity-0 pointer-events-none -z-50">
          {songId && (
            <YouTube
              videoId={songId}
              opts={opts}
              onReady={onPlayerReady}
              onStateChange={onPlayerStateChange} 
            />
          )}
        </div>

        {/*lyrics block */}
        <div className="w-full max-w-3xl text-center pb-32">
          <AnimatePresence mode="wait">
            {lyrics ? (
              <motion.div
                key={songId} 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}
              >
                {/*song title header*/}
                <div className="mb-12">
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                    {song.toUpperCase()}
                  </h1>
                  <h2 className="text-xl md:text-2xl font-light text-pink-200 tracking-[0.2em] uppercase opacity-80">
                    {artist}
                  </h2>
                </div>

                {/*the lyrics text*/}
                <div className="relative">
                   <p className="whitespace-pre-wrap font-sans text-xl md:text-2xl md:leading-[2.5] leading-relaxed text-white/90 font-medium drop-shadow-lg selection:bg-white selection:text-black">
                     {lyrics}
                   </p>
                </div>
              </motion.div>
            ) : (
              !songId && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center mt-20 text-white/20 space-y-4"
                >
                  <Music2 size={64} strokeWidth={1} />
                  <p className="text-xl font-light tracking-widest">START YOUR SEARCH</p>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>

      {/*FLOATING VINYL CONTROLS*/}
      {songId && (
        <motion.div 
          initial={{ y: 200, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center group cursor-pointer" onClick={togglePlay} onTouchEnd={togglePlay}>
            
            {/*glow outside the vinyl*/}
            <div className={`absolute inset-0 rounded-full bg-white/10 blur-xl transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />

            <div 
              className="absolute inset-0 rounded-full border-4 border-black/40 shadow-2xl overflow-hidden bg-neutral-900 animate-[spin_8s_linear_infinite]"
              style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
            >
                {/*album art(zoomed to fill*/}
                <img 
                  src={albumArt} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500 scale-[1.8]" 
                  alt="vinyl-art"
                />
                
                {/*vinyl texture overlay */}
                <div className="absolute inset-0 rounded-full border border-white/5 opacity-20 pointer-events-none" 
                     style={{background: 'repeating-radial-gradient(#000 0, #000 2px, transparent 3px, transparent 4px)'}} />
            </div>

            {/*center play button (does not spin) */}
            <div className="relative z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
              {isPlaying ? <Pause size={20} className="fill-black text-black"/> : <Play size={20} className="fill-black text-black ml-1"/> }
            </div>
            <div className="absolute inset-0 rounded-full overflow-hidden z-50 opacity-0">
                <YouTube
                  videoId={songId}
                  opts={{
                    height: '100%', 
                    width: '100%', 
                    playerVars: {
                      autoplay: 1, 
                      playsinline: 1,
                      controls: 0, // No YouTube UI
                      disablekb: 1,
                      fs: 0,
                      origin: window.location.origin 
                    }
                  }}
                  onReady={onPlayerReady}
                  onStateChange={onPlayerStateChange} 
                />
            </div>
          </div>
        </motion.div>
      )}

    </div>
  )
}

export default App