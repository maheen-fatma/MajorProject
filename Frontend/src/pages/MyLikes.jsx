import React, { useEffect, useState } from 'react'
import { PostPreview } from '../components'
import dbService from '../backend/databases'
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry'
import InfiniteScroll from 'react-infinite-scroll-component'

function MyLikes() {
    const [posts , setPosts] = useState([])
    const [hasMore, setHasMore] = useState(true)
    useEffect(()=>{
      loadPosts()      
    },[])

    const loadPosts = () => {
      dbService.getMyLikes()
        .then((newPosts) => {
          if (newPosts.length > 0)
            setPosts((prevPosts) => [...prevPosts, ...newPosts])  // Directly use the array
          else
            setHasMore(false) // Stop loading when no more posts
        
  })
        
    }
  return (
    <div className=' px-10 p-[20px] '>
      <InfiniteScroll
                dataLength={posts.length}
                next={loadPosts}
                hasMore={hasMore}
                loader={<h4 className=' font-dolce text-2xl tracking-wider'>Loading posts...</h4>}
                endMessage={<p>No more posts</p>}
            >
      <ResponsiveMasonry columnsCountBreakPoints={{350: 2, 750: 3, 900: 4}}>
        <Masonry gutter="25px">
      {posts && posts.map((item,index)=>(
        <div key={index} className=' '>
            <PostPreview {...item.associatedPost} />
        </div>
      ))}
        </Masonry>
      </ResponsiveMasonry>
      </InfiniteScroll>
    </div>
  )
}

export default MyLikes
