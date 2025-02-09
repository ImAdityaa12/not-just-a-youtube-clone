import React from 'react'

type PageProps = {
    params: Promise<{
        videoId: string
    }>
}
const page = async({params}: PageProps) => {
    const {videoId} = await params
    return (
    <div>page {videoId}</div>
  )
}

export default page