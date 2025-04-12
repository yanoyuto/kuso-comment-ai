import { useEffect, useState } from 'react'

const ShareButtons = () => {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  const message = encodeURIComponent('煽りクソコメ生成AIでイラッとするコメントを生成してみた。')
  const hashtags = encodeURIComponent('煽りクソコメ,AI,おもしろWeb')

  const twitterUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${message}&hashtags=${hashtags}`
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}`

  return (
    <div className="flex gap-4 mt-4 justify-center">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition"
      >
        Xでシェア
      </a>
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white px-4 py-2 rounded-full shadow hover:bg-green-600 transition"
      >
        LINEでシェア
      </a>
    </div>
  )
}

export default ShareButtons