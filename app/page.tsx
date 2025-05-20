"use client"

import { useState, useEffect, useRef } from "react"
import { Moon, Sun, Info, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { setTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState("dark")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [viewedPhotos, setViewedPhotos] = useState<Set<number>>(new Set())
  const [infoVisible, setInfoVisible] = useState(false)
  const [donateOpen, setDonateOpen] = useState(false)

  // Ref to track if a key press is being processed
  const isProcessingKey = useRef(false)
  const remainingIndices = useRef<number[]>([])

  const cryptoAddresses = {
    bitcoin: "bc1qxyqmvj9dac3wthtruyen7pg64mej6hhfuw5tx7",
    ethereum: "0x93cDAC9D4DE9638280876E3D617D9D0255CDEB2D",
    litecoin: "Lge7PqpWQXcuX77mXgTgEPtaWQUgjGoMZm",
  }

  // All cat image URLs - now including the new ones
  const catImages = [
    // Original images
    "https://i.imgur.com/Sy1VMZs.png",
    "https://i.imgur.com/ZfcjHYq.png",
    "https://i.imgur.com/c7XLHlY.png",
    "https://i.imgur.com/tCW2Rul.png",
    "https://i.imgur.com/8ZRyrjp.png",
    "https://i.imgur.com/FXvE2Hq.png",
    "https://i.imgur.com/OEIYtiy.png",
    "https://i.imgur.com/qUca1oU.png",
    "https://i.imgur.com/8cCMPjV.png",
    "https://i.imgur.com/dlv2Q9Q.png",
    "https://i.imgur.com/egL0RPo.png",
    "https://i.imgur.com/pxQBR25.png",
    "https://i.imgur.com/dVeiqRr.png",
    "https://i.imgur.com/HW25Rnr.png",
    "https://i.imgur.com/TGs1Pup.png",
    "https://i.imgur.com/vciiLic.png",
    "https://i.imgur.com/qAWtOvI.png",
    "https://i.imgur.com/xNO6Xft.png",
    "https://i.imgur.com/KrYJtYq.png",
    "https://i.imgur.com/c9gx73Q.png",
    "https://i.imgur.com/U0TNTth.png",
    "https://i.imgur.com/pemeVuK.png",
    "https://i.imgur.com/G71ofcw.png",
    "https://i.imgur.com/cJThZkc.png",
    "https://i.imgur.com/FSuJ1lG.png",
    "https://i.imgur.com/B4wvGGO.png",
    "https://i.imgur.com/WqpOrqV.png",
    "https://i.imgur.com/axIUshT.png",
    "https://i.imgur.com/mzYxPVV.png",
    "https://i.imgur.com/6IxP6yd.png",
    "https://i.imgur.com/rVEvzbY.png",
    "https://i.imgur.com/cJXVNeN.png",
    "https://i.imgur.com/HaeN4KV.png",
    "https://i.imgur.com/4Y5Nxni.png",
    "https://i.imgur.com/LYDpXU9.png",
    "https://i.imgur.com/9Qwm5n7.png",
    "https://i.imgur.com/eQofdXu.png",
    "https://i.imgur.com/a65LNe7.png",
    "https://i.imgur.com/VwgV3NX.png",
    "https://i.imgur.com/O0vXiQ6.png",
    "https://i.imgur.com/EOFBoKM.png",
    "https://i.imgur.com/r9pv2Er.png",
    "https://i.imgur.com/t68uGAP.png",
    "https://i.imgur.com/BFsZWjY.png",
    "https://i.imgur.com/oy0FMtT.png",
    "https://i.imgur.com/0hQOD35.png",
    "https://i.imgur.com/pUzi0jY.png",
    "https://i.imgur.com/oHtKpJP.png",
    "https://i.imgur.com/zaDgW5O.png",
    "https://i.imgur.com/xx8XE6Z.jpeg",
    "https://i.imgur.com/NwtcShY.jpeg",
    "https://i.imgur.com/agp6Oa8.jpeg",
    "https://i.imgur.com/bNwcAKc.jpeg",
    "https://i.imgur.com/l962PW3.jpeg",
    "https://i.imgur.com/SLwJwhX.png",
    "https://i.imgur.com/YcmbKmL.png",
    "https://i.imgur.com/KkkXM5u.png",
    "https://i.imgur.com/u6I7yaG.png",
    "https://i.imgur.com/iTmpJes.jpeg",
    "https://i.imgur.com/J5UWrrS.jpeg",
    "https://i.imgur.com/4reb7zp.jpeg",
    "https://i.imgur.com/Cl8MEq8.jpeg",
    "https://i.imgur.com/VX13zDB.jpeg",
    "https://i.imgur.com/RumC3ou.jpeg",
    "https://i.imgur.com/Fu3u7Hd.jpeg",
    "https://i.imgur.com/yVYOVZe.jpeg",
    "https://i.imgur.com/INgSwlH.jpeg",
    "https://i.imgur.com/Ajt2imi.jpeg",
    "https://i.imgur.com/cnwCp9k.jpeg",
    "https://i.imgur.com/lFG1MmV.jpeg",
    "https://i.imgur.com/fA3Twhu.jpeg",
    "https://i.imgur.com/xYRzqNM.jpeg",
    "https://i.imgur.com/QXs6HJn.jpeg",
    "https://i.imgur.com/3GIEfYG.jpeg",
    "https://i.imgur.com/1flevgW.jpeg",
    "https://i.imgur.com/HnDwXIi.jpeg",
    "https://i.imgur.com/IgIPNM9.jpeg",
    "https://i.imgur.com/LQzmh6r.jpeg",
    "https://i.imgur.com/UgdVUDJ.jpeg",
    "https://i.imgur.com/tyTv0IG.jpeg",
    "https://i.imgur.com/HjjpbU7.jpeg",
    "https://i.imgur.com/9SZahO7.jpeg",
    "https://i.imgur.com/2RcSycE.jpeg",
    "https://i.imgur.com/MdIvRsm.jpeg",
    "https://i.imgur.com/IQCUgOG.jpeg",
    "https://i.imgur.com/RhjE2S5.jpeg",
    "https://i.imgur.com/gICP3Pn.jpeg",
    "https://i.imgur.com/ey12fSx.jpeg",
    "https://i.imgur.com/8ZMx4Y3.jpeg",
    "https://i.imgur.com/7lzyzHQ.jpeg",
    "https://i.imgur.com/UC4FycF.jpeg",
    "https://i.imgur.com/AkQa4BZ.jpeg",
    "https://i.imgur.com/dKfjWh3.jpeg",
    "https://i.imgur.com/ZoM8vNN.jpeg",
    "https://i.imgur.com/YwGUov8.jpeg",
    "https://i.imgur.com/XF2bOlE.jpeg",
    "https://i.imgur.com/R6CM4xL.jpeg",
    "https://i.imgur.com/z7cS6XS.jpeg",
    "https://i.imgur.com/E4qPFmL.jpeg",
    "https://i.imgur.com/TAPYUEX.jpeg",
    "https://i.imgur.com/xdyOEs1.jpeg",
    "https://i.imgur.com/JuUAgFk.jpeg",
    "https://i.imgur.com/cfecsxG.jpeg",
    "https://i.imgur.com/ePX8BkL.jpeg",
    "https://i.imgur.com/RIxPtW3.jpeg",
    "https://i.imgur.com/j9rfRch.jpeg",
    "https://i.imgur.com/M6zxFD5.jpeg",
    "https://i.imgur.com/qtpeq7W.jpeg",
    "https://i.imgur.com/7dZDzAI.jpeg",
    "https://i.imgur.com/jqpgDMu.jpeg",
    "https://i.imgur.com/MfnHsru.jpeg",
    "https://i.imgur.com/Ioch8KY.jpeg",
    "https://i.imgur.com/viMgVeZ.jpeg",
    "https://i.imgur.com/oMSwB90.jpeg",
    "https://i.imgur.com/YpAIa53.jpeg",
    "https://i.imgur.com/E0cJCef.jpeg",
    "https://i.imgur.com/lVAK8mM.jpeg",
    "https://i.imgur.com/6ZomqNj.jpeg",
    "https://i.imgur.com/mLUDv58.jpeg",
    "https://i.imgur.com/ksPB1DD.jpeg",
    "https://i.imgur.com/iMGjtez.jpeg",
    "https://i.imgur.com/Dms4KCo.jpeg",
    "https://i.imgur.com/xofmj5A.jpeg",
    "https://i.imgur.com/i8L5ex6.jpeg",
    "https://i.imgur.com/Cvo2sTx.png",
    "https://i.imgur.com/fsBbuD7.png",
    "https://i.imgur.com/7AzS9Lz.jpeg",
    "https://i.imgur.com/fo25jbU.png",
    "https://i.imgur.com/mXbs5oi.jpeg",
    "https://i.imgur.com/q1tzFdM.jpeg",
    "https://i.imgur.com/uadn4tR.jpeg",
    "https://i.imgur.com/OKsYAA6.jpeg",
    "https://i.imgur.com/k9rnA7N.jpeg",
    "https://i.imgur.com/rXiRVXu.jpeg",
    "https://i.imgur.com/OsPQ1xK.jpeg",
    "https://i.imgur.com/x3xZxKT.jpeg",
    "https://i.imgur.com/aKEszn1.jpeg",
    "https://i.imgur.com/TySL462.jpeg",
    "https://i.imgur.com/3OAoZO9.png",
    "https://i.imgur.com/fy2U1ie.jpeg",
    "https://i.imgur.com/9gPwyKm.jpeg",
    "https://i.imgur.com/s0g7Vjn.jpeg",
    "https://i.imgur.com/fqjq515.jpeg",
    "https://i.imgur.com/zNsah8D.jpeg",
    "https://i.imgur.com/ymDfBW6.jpeg",
    "https://i.imgur.com/Xn8ekao.jpeg",
    "https://i.imgur.com/LbmiQGq.jpeg",
    "https://i.imgur.com/zMuU5qH.jpeg",
    "https://i.imgur.com/TDiu30u.jpeg",
    "https://i.imgur.com/3DSVpHU.jpeg",
    "https://i.imgur.com/R5J5NEH.jpeg",
    "https://i.imgur.com/oD7RhTA.jpeg",
    "https://i.imgur.com/JS73vLV.jpeg",
    "https://i.imgur.com/S5RGmha.jpeg",
    "https://i.imgur.com/6gdvKid.jpeg",
    "https://i.imgur.com/0Pa3n81.jpeg",
    "https://i.imgur.com/YL5F252.jpeg",
    "https://i.imgur.com/NBB18DR.jpeg",
    "https://i.imgur.com/GE7oEUD.jpeg",
    "https://i.imgur.com/dnSa4g0.jpeg",
    "https://i.imgur.com/D3mFKVG.jpeg",
    "https://i.imgur.com/T1gJP3I.jpeg",
    "https://i.imgur.com/0Xyi2pb.jpeg",
    "https://i.imgur.com/HfEvhOi.jpeg",
    "https://i.imgur.com/iXSUGTl.jpeg",
    "https://i.imgur.com/3yaIXxC.jpeg",
    "https://i.imgur.com/RBcoaQn.jpeg",
    "https://i.imgur.com/Eeiuh14.jpeg",
    "https://i.imgur.com/yZBNrJp.png",
    "https://i.imgur.com/4UtJjs3.jpeg",
    "https://i.imgur.com/gDaK95h.jpeg",
    "https://i.imgur.com/czGpPsa.png",
    "https://i.imgur.com/uAPXYa7.jpeg",
    "https://i.imgur.com/c4U3G8r.jpeg",
    "https://i.imgur.com/dVztHKY.jpeg",
    "https://i.imgur.com/XB3zLZq.jpeg",
    "https://i.imgur.com/gGdNWkt.png",
    "https://i.imgur.com/2zjHdyz.jpeg",
    "https://i.imgur.com/p8dCQVu.png",
    "https://i.imgur.com/cZn4FFx.jpeg",
    "https://i.imgur.com/FFdAUkL.jpeg",
    "https://i.imgur.com/NOi96d6.jpeg",
    "https://i.imgur.com/EYZhy0E.jpeg",
    "https://i.imgur.com/v2cNfH5.jpeg",
    "https://i.imgur.com/57ssTCc.jpeg",
    "https://i.imgur.com/Ny7d1Ln.jpeg",
    "https://i.imgur.com/nIIwrtH.jpeg",
    "https://i.imgur.com/ehaGjgk.jpeg",
    "https://i.imgur.com/P7RStDE.jpeg",
    "https://i.imgur.com/YKW1NCr.jpeg",
    "https://i.imgur.com/FKjim0H.jpeg",
    "https://i.imgur.com/nPkAvYR.jpeg",
    "https://i.imgur.com/Ywt2Ksh.jpeg",
    "https://i.imgur.com/ZnJQbQS.jpeg",
    "https://i.imgur.com/WgEENjq.jpeg",
    "https://i.imgur.com/hBdPiUu.jpeg",
    "https://i.imgur.com/ZnNSeIT.jpeg",
    "https://i.imgur.com/VX4jtxM.jpeg",
    "https://i.imgur.com/Bgg4M72.jpeg",
    "https://i.imgur.com/uGz5IRm.jpeg",
    "https://i.imgur.com/hXj9xo0.jpeg",
    "https://i.imgur.com/xY615VS.jpeg",
    "https://i.imgur.com/gFzbIM5.jpeg",
    "https://i.imgur.com/ltnFkQs.jpeg",
    "https://i.imgur.com/hn46sJm.jpeg",
    "https://i.imgur.com/4dUWqgB.jpeg",
    "https://i.imgur.com/7zy4GlU.jpeg",
    "https://i.imgur.com/Ur5ipho.jpeg",
    "https://i.imgur.com/0f2Ev37.jpeg",

    // New images
    "https://i.imgur.com/yhgGtKl.jpeg",
    "https://i.imgur.com/58ZFeie.jpeg",
    "https://i.imgur.com/3qI3pZu.jpeg",
    "https://i.imgur.com/GjZM6ZV.jpeg",
    "https://i.imgur.com/Z1tMTu2.jpeg",
    "https://i.imgur.com/LoRkjxS.jpeg",
    "https://i.imgur.com/tZeozOG.jpeg",
    "https://i.imgur.com/qGX0wfz.jpeg",
    "https://i.imgur.com/NkEE1uc.jpeg",
    "https://i.imgur.com/Q8WepDF.jpeg",
    "https://i.imgur.com/AGccybb.jpeg",
    "https://i.imgur.com/WrPXq7F.jpeg",
    "https://i.imgur.com/jzyeV6P.jpeg",
    "https://i.imgur.com/9gVXO4E.jpeg",
    "https://i.imgur.com/UiWPrOj.jpeg",
    "https://i.imgur.com/vIZ5FL4.jpeg",
    "https://i.imgur.com/PehrzEX.jpeg",
    "https://i.imgur.com/buENMHB.jpeg",
    "https://i.imgur.com/QEY8jnV.jpeg",
    "https://i.imgur.com/ChCFl2u.jpeg",
    "https://i.imgur.com/TGoa1hF.jpeg",
    "https://i.imgur.com/xq4pdfj.jpeg",
    "https://i.imgur.com/O8Kkl0l.jpeg",
    "https://i.imgur.com/RHs6gsP.jpeg",
    "https://i.imgur.com/tqpkwL6.jpeg",
    "https://i.imgur.com/Mqsvb5B.jpeg",
    "https://i.imgur.com/KzvX2F1.jpeg",
    "https://i.imgur.com/NBqhDwX.jpeg",
    "https://i.imgur.com/zqujX3G.jpeg",
    "https://i.imgur.com/M6fmjg4.jpeg",
    "https://i.imgur.com/HQEXh15.jpeg",
    "https://i.imgur.com/JMmYS8F.jpeg",
    "https://i.imgur.com/ZBD0BhN.jpeg",
    "https://i.imgur.com/wnmcZLU.jpeg",
    "https://i.imgur.com/WKJiUCg.jpeg",
    "https://i.imgur.com/g9UCsfI.jpeg",
    "https://i.imgur.com/s0hvcq4.jpeg",
    "https://i.imgur.com/fsQck4y.png",
    "https://i.imgur.com/1Cnc1im.png",
    "https://i.imgur.com/ie8S3L7.png",
    "https://i.imgur.com/50F0zQe.jpeg",
    "https://i.imgur.com/AjyHcei.jpeg",
    "https://i.imgur.com/N4RNnYF.jpeg",
    "https://i.imgur.com/Gy9ZTdd.jpeg",
    "https://i.imgur.com/FvVGvNt.jpeg",
    "https://i.imgur.com/O80SUF5.jpeg",
    "https://i.imgur.com/RaPHxnu.jpeg",
    "https://i.imgur.com/FEPzEtn.jpeg",
    "https://i.imgur.com/80CQ6qT.png",
    "https://i.imgur.com/Dd6kgxN.jpeg",
    "https://i.imgur.com/TQL57xL.jpeg",
  ]

  // Function to copy text to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      description: `${type} address copied to clipboard!`,
      duration: 2000,
    })
  }

  // Initialize remaining indices
  useEffect(() => {
    remainingIndices.current = Array.from({ length: catImages.length }, (_, i) => i)
  }, [catImages.length])

  // Function to get a new random image that hasn't been shown yet
  const getRandomImage = () => {
    setIsLoading(true)

    // If we've shown all images, reset the remaining indices
    if (remainingIndices.current.length === 0) {
      remainingIndices.current = Array.from({ length: catImages.length }, (_, i) => i)
      setViewedPhotos(new Set())
    }

    // Get a random index from the remaining indices
    const randomPosition = Math.floor(Math.random() * remainingIndices.current.length)
    const newIndex = remainingIndices.current[randomPosition]

    // Remove the selected index from remaining indices
    remainingIndices.current.splice(randomPosition, 1)

    // Update state
    setCurrentIndex(newIndex)
    setViewedPhotos((prev) => new Set(prev).add(newIndex))
  }

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    setCurrentTheme(newTheme)
    setTheme(newTheme)
  }

  // Completely rewritten Enter key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process Enter key and only if we're not already processing a key press
      if (e.key === "Enter" && !isProcessingKey.current) {
        // Set the flag to prevent multiple rapid keypresses
        isProcessingKey.current = true

        // Change the image
        getRandomImage()

        // Reset the flag after a delay to prevent multiple triggers
        setTimeout(() => {
          isProcessingKey.current = false
        }, 500) // Longer delay to ensure the image has time to load
      }
    }

    // Add the event listener
    window.addEventListener("keydown", handleKeyDown)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, []) // Empty dependency array means this only runs once on mount

  // Initialize with a random image on first load and set dark theme
  useEffect(() => {
    setMounted(true)
    setTheme("dark")
    setCurrentTheme("dark")
    getRandomImage()
  }, [])

  if (!mounted) return null

  // Calculate progress as percentage of unique photos viewed
  const progressPercentage = (viewedPhotos.size / catImages.length) * 100

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-4 transition-colors duration-300 ${
        currentTheme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="fixed top-4 right-4 flex items-center gap-4 z-10">
        <Dialog open={donateOpen} onOpenChange={setDonateOpen}>
          <DialogTrigger asChild>
            <Button
              variant={currentTheme === "dark" ? "outline" : "default"}
              size="sm"
              className={`flex items-center gap-1 ${currentTheme === "light" ? "bg-white text-black hover:bg-gray-100" : ""}`}
            >
              <Heart className={`h-4 w-4 ${currentTheme === "light" ? "text-black" : ""}`} />
              <span className={`hidden sm:inline ${currentTheme === "light" ? "text-black" : ""}`}>Donate</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-light tracking-tight">Support This Project</DialogTitle>
              <DialogDescription className="text-base font-light mt-2">
                New photos every monday. If you would like to support me, you can make a donation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium tracking-wide uppercase text-muted-foreground">Bitcoin</h3>
                <div
                  className="p-3 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => copyToClipboard(cryptoAddresses.bitcoin, "Bitcoin")}
                >
                  <p className="font-mono text-sm">{cryptoAddresses.bitcoin}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium tracking-wide uppercase text-muted-foreground">Ethereum</h3>
                <div
                  className="p-3 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => copyToClipboard(cryptoAddresses.ethereum, "Ethereum")}
                >
                  <p className="font-mono text-sm">{cryptoAddresses.ethereum}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium tracking-wide uppercase text-muted-foreground">Litecoin</h3>
                <div
                  className="p-3 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => copyToClipboard(cryptoAddresses.litecoin, "Litecoin")}
                >
                  <p className="font-mono text-sm">{cryptoAddresses.litecoin}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {currentTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button variant="ghost" size="icon" aria-label="Information" onClick={() => setInfoVisible(!infoVisible)}>
          <Info className="h-5 w-5" />
        </Button>
      </div>

      {infoVisible && (
        <div className="fixed top-16 right-4 bg-secondary p-4 rounded-md shadow-md max-w-xs z-10">
          <p className="text-sm">
            If you would like to see photos of your own cat or cats you find funny, you can reach me via Discord. My
            username is uefyy
          </p>
        </div>
      )}

      <div className="w-full max-w-3xl flex flex-col items-center gap-6">
        <div className="relative w-full max-h-[70vh] aspect-auto rounded-lg overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={catImages[currentIndex] || "/placeholder.svg"}
              alt="Random cat photo"
              className={`max-w-full max-h-[70vh] w-auto h-auto object-contain transition-opacity duration-300 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setIsLoading(false)}
              width={800}
              height={800}
              priority
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              Viewed {viewedPhotos.size} of {catImages.length} photos ({Math.round(progressPercentage)}%)
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1" />
        </div>

        <div className="fixed bottom-8">
          <Button onClick={getRandomImage} className="px-8 py-6 text-lg">
            Show Another Cat
          </Button>
        </div>
      </div>
    </main>
  )
}
