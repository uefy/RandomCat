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

  // All cat image URLs - now including all the new ones
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

    // First batch of new images
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

    // Second batch of new images
    "https://i.imgur.com/IHwA7db.jpeg",
    "https://i.imgur.com/FkY3qkj.jpeg",
    "https://i.imgur.com/YQreyg6.jpeg",
    "https://i.imgur.com/09XpIzd.jpeg",
    "https://i.imgur.com/r45bx3y.jpeg",
    "https://i.imgur.com/fXSAs2x.jpeg",
    "https://i.imgur.com/ylk7brb.jpeg",
    "https://i.imgur.com/uGt8dge.jpeg",
    "https://i.imgur.com/P2N3Z69.jpeg",
    "https://i.imgur.com/6CqMvhF.jpeg",
    "https://i.imgur.com/m8xvqL7.jpeg",
    "https://i.imgur.com/Yab7WuB.jpeg",
    "https://i.imgur.com/te9gY77.jpeg",
    "https://i.imgur.com/B5nOl3Q.jpeg",
    "https://i.imgur.com/Lsh9Z9f.jpeg",
    "https://i.imgur.com/qYc1suS.jpeg",
    "https://i.imgur.com/QEdywre.jpeg",
    "https://i.imgur.com/YomrPYM.jpeg",
    "https://i.imgur.com/rNirI0S.jpeg",
    "https://i.imgur.com/YSxINUZ.jpeg",
    "https://i.imgur.com/4TSm0Lp.jpeg",
    "https://i.imgur.com/IhnZoQu.jpeg",
    "https://i.imgur.com/4A98FkG.jpeg",
    "https://i.imgur.com/UKMOwBT.jpeg",
    "https://i.imgur.com/lQjYjY6.jpeg",
    "https://i.imgur.com/nPqzpQS.jpeg",
    "https://i.imgur.com/TmrRBoH.jpeg",
    "https://i.imgur.com/sG8znOt.jpeg",
    "https://i.imgur.com/dY1gPDz.jpeg",
    "https://i.imgur.com/xUlCAti.jpeg",
    "https://i.imgur.com/foOL0cx.jpeg",
    "https://i.imgur.com/e1UiAI6.jpeg",
    "https://i.imgur.com/06KwxA8.jpeg",
    "https://i.imgur.com/IpepBqM.jpeg",
    "https://i.imgur.com/cts1Qjf.jpeg",
    "https://i.imgur.com/nWwvVsn.jpeg",
    "https://i.imgur.com/cOcHKDt.jpeg",
    "https://i.imgur.com/KGqac7z.jpeg",
    "https://i.imgur.com/OsRubo5.jpeg",
    "https://i.imgur.com/BnFfLJZ.jpeg",
    "https://i.imgur.com/mAc7qwh.jpeg",
    "https://i.imgur.com/gzhcRzm.jpeg",
    "https://i.imgur.com/oWxVjoQ.jpeg",
    "https://i.imgur.com/EsGBDYo.jpeg",
    "https://i.imgur.com/gGi2IcV.jpeg",
    "https://i.imgur.com/sRUqLN9.jpeg",
    "https://i.imgur.com/Jsb0Jvr.jpeg",
    "https://i.imgur.com/BRjB2nI.jpeg",
    "https://i.imgur.com/OXo6yUp.jpeg",
    "https://i.imgur.com/2FNoYED.jpeg",
    "https://i.imgur.com/pVbEzrQ.jpeg",
    "https://i.imgur.com/GSGChVv.jpeg",
    "https://i.imgur.com/lgTiLiw.jpeg",
    "https://i.imgur.com/IIlCFin.jpeg",
    "https://i.imgur.com/gOXRHrN.jpeg",
    "https://i.imgur.com/S8JGLmc.jpeg",
    "https://i.imgur.com/QsgpSWQ.jpeg",
    "https://i.imgur.com/RlBow5l.jpeg",
    "https://i.imgur.com/jyqnUCv.jpeg",
    "https://i.imgur.com/mtHzeRa.jpeg",
    "https://i.imgur.com/dvOEn2G.jpeg",
    "https://i.imgur.com/1RVyOfS.jpeg",
    "https://i.imgur.com/Nnc3jWB.jpeg",
    "https://i.imgur.com/WcxWH1v.jpeg",
    "https://i.imgur.com/9geTGyX.jpeg",
    "https://i.imgur.com/xd337vQ.jpeg",
    "https://i.imgur.com/HcVuweP.jpeg",
    "https://i.imgur.com/k3aEKQj.jpeg",
    "https://i.imgur.com/wVTRcFL.jpeg",
    "https://i.imgur.com/tMHGq8D.jpeg",
    "https://i.imgur.com/Qxzvd3l.jpeg",
    "https://i.imgur.com/rFcjvq8.jpeg",
    "https://i.imgur.com/Ot1bY9V.jpeg",
    "https://i.imgur.com/SzK9Gqs.jpeg",
    "https://i.imgur.com/0ui7WXO.jpeg",
    "https://i.imgur.com/UDI5eg7.jpeg",
    "https://i.imgur.com/w6ktaJ9.jpeg",
    "https://i.imgur.com/YetnBXR.jpeg",
    "https://i.imgur.com/XOVXMoU.jpeg",
    "https://i.imgur.com/u5EEOYT.jpeg",
    "https://i.imgur.com/aQxIfez.jpeg",
    "https://i.imgur.com/1CrOq1G.jpeg",
    "https://i.imgur.com/tlYsCNR.jpeg",
    "https://i.imgur.com/jMLAPSz.jpeg",
    "https://i.imgur.com/bcZu4MK.jpeg",
    "https://i.imgur.com/9qJWGf2.jpeg",
    "https://i.imgur.com/tXPVxfZ.jpeg",
    "https://i.imgur.com/1GpIjXy.jpeg",
    "https://i.imgur.com/f52tgrb.jpeg",
    "https://i.imgur.com/HDsAOpq.jpeg",
    "https://i.imgur.com/gZga2EX.jpeg",
    "https://i.imgur.com/zTRkwf3.jpeg",
    "https://i.imgur.com/2c8VnuS.jpeg",
    "https://i.imgur.com/L5ypPUx.jpeg",
    "https://i.imgur.com/IEpIPIE.jpeg",
    "https://i.imgur.com/MZqoMHn.jpeg",
    "https://i.imgur.com/Zbq5Y9k.jpeg",
    "https://i.imgur.com/SANFNdv.jpeg",
    "https://i.imgur.com/r8G04sE.jpeg",
    "https://i.imgur.com/GDGFPgX.jpeg",
    "https://i.imgur.com/VrGUkpZ.jpeg",
    "https://i.imgur.com/c49qnja.jpeg",
    "https://i.imgur.com/VhcvGD6.jpeg",
    "https://i.imgur.com/evqKylq.jpeg",
    "https://i.imgur.com/ucWSLzB.jpeg",
    "https://i.imgur.com/o8vApuA.jpeg",
    "https://i.imgur.com/d1jLgAf.jpeg",
    "https://i.imgur.com/59Uxei8.jpeg",
    "https://i.imgur.com/lOSs7Ix.jpeg",
    "https://i.imgur.com/nnzjVGx.jpeg",
    "https://i.imgur.com/fiIdvhw.jpeg",
    "https://i.imgur.com/DpHHfMy.jpeg",
    "https://i.imgur.com/IfD1kFU.jpeg",
    "https://i.imgur.com/ZVXycU3.jpeg",
    "https://i.imgur.com/7g8vNoT.jpeg",
    "https://i.imgur.com/EXiclJa.jpeg",
    "https://i.imgur.com/a0DJvRG.jpeg",
    "https://i.imgur.com/7qPTWbt.jpeg",

    "https://i.imgur.com/1OEJHNv.jpeg",
    "https://i.imgur.com/JLFA87j.jpeg",
    "https://i.imgur.com/xPoHnRA.jpeg",
    "https://i.imgur.com/ckDPoaR.jpeg",
    "https://i.imgur.com/OsesnOh.jpeg",
    "https://i.imgur.com/Qcy0NVQ.jpeg",
    "https://i.imgur.com/ZWSNLQb.jpeg",
    "https://i.imgur.com/08iPxHf.jpeg",
    "https://i.imgur.com/ktn2oEP.jpeg",
    "https://i.imgur.com/THDWLi3.jpeg",
    "https://i.imgur.com/V1L40Ea.jpeg",
    "https://i.imgur.com/AtaNRwH.jpeg",
    "https://i.imgur.com/91zWJ7z.jpeg",
    "https://i.imgur.com/XlhjWgB.jpeg",
    "https://i.imgur.com/7gVdSy9.jpeg",
    "https://i.imgur.com/9EcgsHX.png",
    "https://i.imgur.com/9jqDUUY.jpeg",
    "https://i.imgur.com/aTsUdUi.jpeg",
    "https://i.imgur.com/btNNOiV.jpeg",
    "https://i.imgur.com/zjdUo57.jpeg",
    "https://i.imgur.com/qEsQnbG.jpeg",
    "https://i.imgur.com/vI9lw11.jpeg",
    "https://i.imgur.com/619ra0b.jpeg",
    "https://i.imgur.com/4MfJ8Zl.jpeg",
    "https://i.imgur.com/ODKhqod.jpeg",
    "https://i.imgur.com/awnjTIX.jpeg",
    "https://i.imgur.com/dHXf53d.jpeg",
    "https://i.imgur.com/8DpRsrv.jpeg",
    "https://i.imgur.com/oOgSiwJ.jpeg",
    "https://i.imgur.com/YmQdw5D.jpeg",
    "https://i.imgur.com/d0UdV6g.jpeg",
    "https://i.imgur.com/7kKXuD4.jpeg",
    "https://i.imgur.com/mlxOgLw.jpeg",
    "https://i.imgur.com/adrvBdX.png",
    "https://i.imgur.com/QcjAvNG.jpeg",
    "https://i.imgur.com/7yGbIj1.jpeg",
    "https://i.imgur.com/AltnB4Q.jpeg",
    "https://i.imgur.com/rSlvSDk.jpeg",
    "https://i.imgur.com/3vr2rjx.jpeg",
    "https://i.imgur.com/ZLKHpzW.jpeg",
    "https://i.imgur.com/JwguojB.jpeg",
    "https://i.imgur.com/MG8Xk7R.jpeg",
    "https://i.imgur.com/gWpHp4G.jpeg",
    "https://i.imgur.com/Wh7woan.jpeg",
    "https://i.imgur.com/wifbnLP.jpeg",
    "https://i.imgur.com/sjB1hDX.jpeg",
    "https://i.imgur.com/LF7rvAA.jpeg",
    "https://i.imgur.com/GFZvlqp.jpeg",
    "https://i.imgur.com/UZ0ra1R.jpeg",
    "https://i.imgur.com/9E9QUTF.jpeg",
    "https://i.imgur.com/gLHBkTK.jpeg",
    "https://i.imgur.com/HnNngMU.jpeg",
    "https://i.imgur.com/4CdjCFp.jpeg",
    "https://i.imgur.com/LOP9d6S.jpeg",
    "https://i.imgur.com/dlllgjm.jpeg",
    "https://i.imgur.com/75IAdqG.jpeg",
    "https://i.imgur.com/iTHSpdY.jpeg",
    "https://i.imgur.com/dbIIVpG.jpeg",
    "https://i.imgur.com/JI5B4Ye.jpeg",
    "https://i.imgur.com/q9VIAkM.jpeg",
    "https://i.imgur.com/tT0B0lL.jpeg",
    "https://i.imgur.com/Y9tjUJJ.jpeg",
    "https://i.imgur.com/nGbrUYg.jpeg",
    "https://i.imgur.com/Kmns8LM.jpeg",
    "https://i.imgur.com/2qtoFvp.jpeg",
    "https://i.imgur.com/O3hfCnz.jpeg",
    "https://i.imgur.com/ghydTSw.jpeg",
    "https://i.imgur.com/rDDOMxW.jpeg",
    "https://i.imgur.com/rQTCwaM.jpeg",
    "https://i.imgur.com/ZadWyRU.jpeg",
    "https://i.imgur.com/6KpgBVY.jpeg",
    "https://i.imgur.com/F5lGo8R.jpeg",
    "https://i.imgur.com/djDqHoi.jpeg",
    "https://i.imgur.com/0TEudMP.jpeg",
    "https://i.imgur.com/zhIMuvz.jpeg",
    "https://i.imgur.com/WqvfIp0.jpeg",
    "https://i.imgur.com/ny9czx9.jpeg",
    "https://i.imgur.com/5RNRtfY.jpeg",
    "https://i.imgur.com/O6EjI3V.jpeg",
    "https://i.imgur.com/LfE1NcF.jpeg",
    "https://i.imgur.com/WVkDqCe.jpeg",
    "https://i.imgur.com/iI8dLwD.jpeg",
    "https://i.imgur.com/4CHUiMR.jpeg",
    "https://i.imgur.com/1wduXrV.jpeg",
    "https://i.imgur.com/4GJmXXw.jpeg",
    "https://i.imgur.com/hOorl83.jpeg",
    "https://i.imgur.com/nYoFB2z.jpeg",
    "https://i.imgur.com/dTZS4ay.jpeg",
    "https://i.imgur.com/KePnoNy.jpeg",
    "https://i.imgur.com/11HK27S.jpeg",
    "https://i.imgur.com/1B6xxDS.jpeg",
    "https://i.imgur.com/sCDSZu1.jpeg",
    "https://i.imgur.com/B7Pmoma.jpeg",
    "https://i.imgur.com/RP3lPjq.jpeg",
    "https://i.imgur.com/2fpFATS.jpeg",
    "https://i.imgur.com/tPFMLIR.jpeg",
    "https://i.imgur.com/gzK2JSJ.jpeg",
    "https://i.imgur.com/VnKEeQx.jpeg",
    "https://i.imgur.com/NzCL16g.jpeg",
    "https://i.imgur.com/vNhqOpI.jpeg",
    "https://i.imgur.com/NX2kxnQ.jpeg",
    "https://i.imgur.com/3PNpYsE.jpeg",
    "https://i.imgur.com/NaXyfTa.jpeg",
    "https://i.imgur.com/fAyjWt7.jpeg",
    "https://i.imgur.com/S57p0IG.jpeg",
    "https://i.imgur.com/hgL6Tkl.jpeg",
    "https://i.imgur.com/kAqQHQC.jpeg",
    "https://i.imgur.com/ZyJPfAx.jpeg",
    "https://i.imgur.com/bUooJ5h.jpeg",
    "https://i.imgur.com/Rx0KVds.jpeg",
    "https://i.imgur.com/CUEiOUu.jpeg",
    "https://i.imgur.com/5m2ZE5h.jpeg",
    "https://i.imgur.com/hmVqC05.jpeg",
    "https://i.imgur.com/2ejNnzl.jpeg",
    "https://i.imgur.com/hBfP9fQ.jpeg",
    "https://i.imgur.com/wLmkCHV.jpeg",
    "https://i.imgur.com/tm4SBaV.jpeg",
    "https://i.imgur.com/vTtkVOA.jpeg",
    "https://i.imgur.com/YAFjGSc.jpeg",
    "https://i.imgur.com/uer68W4.jpeg",
    "https://i.imgur.com/oVWcMyz.jpeg",
    "https://i.imgur.com/V5ZqI2f.jpeg",
    "https://i.imgur.com/ZrgJlfm.jpeg",
    "https://i.imgur.com/I1c2fk1.jpeg",
    "https://i.imgur.com/aHWLYhv.jpeg",
    "https://i.imgur.com/DxmEuiQ.jpeg",
    "https://i.imgur.com/18sEe7q.jpeg",
    "https://i.imgur.com/RLOZPN2.jpeg",
    "https://i.imgur.com/5leDxuH.jpeg",
    "https://i.imgur.com/DcCVogS.jpeg",
    "https://i.imgur.com/uw78jiK.jpeg",
    "https://i.imgur.com/UMfXWo6.jpeg",
    "https://i.imgur.com/Gl1zNGw.jpeg",
    "https://i.imgur.com/y5dJnkx.jpeg",
    "https://i.imgur.com/SdlBYhf.jpeg",
    "https://i.imgur.com/oYYkgC1.jpeg",
    "https://i.imgur.com/J9SHa5Z.jpeg",
    "https://i.imgur.com/D8gPVcc.jpeg",
    "https://i.imgur.com/nwXboWe.jpeg",
    "https://i.imgur.com/HFC5Eme.jpeg",
    "https://i.imgur.com/795HlBg.jpeg",
    "https://i.imgur.com/QNLNZ40.jpeg",
    "https://i.imgur.com/vnwbc3x.jpeg",
    "https://i.imgur.com/WSqA1kx.jpeg",
    "https://i.imgur.com/XkmmaBo.jpeg",
    "https://i.imgur.com/smPjTVj.jpeg",
    "https://i.imgur.com/whqZVJN.jpeg",
    "https://i.imgur.com/wefa3DL.jpeg",
    "https://i.imgur.com/UnIYToj.jpeg",
    "https://i.imgur.com/mRzCoWE.jpeg",
    "https://i.imgur.com/VZ37Az5.jpeg",
    "https://i.imgur.com/HjZsgAn.jpeg",
    "https://i.imgur.com/4Rx9B80.jpeg",
    "https://i.imgur.com/A99kqAp.jpeg",
    "https://i.imgur.com/wh8WLv0.jpeg",
    "https://i.imgur.com/OJzqlsf.jpeg",
    "https://i.imgur.com/gQIFdGf.jpeg",
    "https://i.imgur.com/2DNYGBi.jpeg",
    "https://i.imgur.com/57UD0DC.jpeg",
    "https://i.imgur.com/TrZGryk.jpeg",
    "https://i.imgur.com/TCVW5vM.jpeg",
    "https://i.imgur.com/R0IYbrV.jpeg",
    "https://i.imgur.com/W3ei83S.jpeg",
    "https://i.imgur.com/8liCQ1p.jpeg",
    "https://i.imgur.com/tT4I9M3.jpeg",
    "https://i.imgur.com/yuLcdiv.jpeg",
    "https://i.imgur.com/IS8t9Ez.jpeg",
    "https://i.imgur.com/0i6aKhs.jpeg",
    "https://i.imgur.com/09YkMPS.jpeg",
    "https://i.imgur.com/zAE99AB.jpeg",
    "https://i.imgur.com/p8fXZOy.jpeg",
    "https://i.imgur.com/9xxBVUi.jpeg",
    "https://i.imgur.com/AJf9y1D.jpeg",
    "https://i.imgur.com/vG1ofa6.jpeg",
    "https://i.imgur.com/BpJNohT.jpeg",
    "https://i.imgur.com/zqC1VkC.jpeg",
    "https://i.imgur.com/ibDB6Tu.jpeg",
    "https://i.imgur.com/hU440DA.jpeg",
    "https://i.imgur.com/zsPyp64.jpeg",
    "https://i.imgur.com/yqsvF9S.jpeg",
    "https://i.imgur.com/H9GbDxb.jpeg",
    "https://i.imgur.com/IvwI3mh.jpeg",
    "https://i.imgur.com/nIyl8SV.jpeg",
    "https://i.imgur.com/jwIbsBh.jpeg",
    "https://i.imgur.com/eKqkh1l.jpeg",
    "https://i.imgur.com/eSwG0rq.jpeg",
    "https://i.imgur.com/82toA2j.jpeg",
    "https://i.imgur.com/Ldy5lfb.jpeg",
    "https://i.imgur.com/JcSKtlf.jpeg",
    "https://i.imgur.com/orbxlHs.jpeg",
    "https://i.imgur.com/qoaRuMC.jpeg",
    "https://i.imgur.com/c1i1diM.jpeg",
    "https://i.imgur.com/228n3es.jpeg",
    "https://i.imgur.com/K0sWYMz.jpeg",
    "https://i.imgur.com/du1t4A9.jpeg",
    "https://i.imgur.com/Axi6dZ2.jpeg",
    "https://i.imgur.com/70v7JLy.jpeg",
    "https://i.imgur.com/Z8zKyGA.jpeg",
    "https://i.imgur.com/uS3BjW2.jpeg",
    "https://i.imgur.com/p6mvCn8.jpeg",
    "https://i.imgur.com/zGG59D0.jpeg",
    "https://i.imgur.com/xFm7yvZ.jpeg",
    "https://i.imgur.com/3X83c1b.jpeg",
    "https://i.imgur.com/73ZSHXC.jpeg",
    "https://i.imgur.com/UJzDCh0.jpeg",
    "https://i.imgur.com/7FgkAPj.jpeg",
    "https://i.imgur.com/ee6EVwn.jpeg",
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
