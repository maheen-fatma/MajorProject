import React, { useEffect, useState } from 'react'
import { PostPreview } from '../components'
import dbService from '../appwrite/databases'
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry'
import InfiniteScroll from 'react-infinite-scroll-component'

function AllPosts() {
    const [posts , setPosts] = useState([])
    const [hasMore, setHasMore] = useState(true)
    useEffect(()=>{
      loadPosts()      
    },[])

    const loadPosts = () => {
      dbService.getAllPost()
        .then((newPosts)=>{
            if(newPosts && newPosts.documents.length > 0)
                setPosts((prevPosts) => [...prevPosts, ...newPosts.documents]) //the getAllPosts function returns an object with documents as a property which inturn is an array of objects containiing all the info of the posts
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
      {posts && posts.map((item)=>(
        <div key={item.$id} className=' '>
            <PostPreview {...item} />
        </div>
      ))}
        </Masonry>
      </ResponsiveMasonry>
      </InfiniteScroll>
    </div>
  )
}

export default AllPosts
