import React, { useState , useEffect } from 'react'
import dbService from '../appwrite/databases'
import { PostPreview } from '../components'
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function MyPosts() {
  const [posts, setPosts] = useState([])
  const userData = useSelector((state)=>(state.auth.userInfo))
  useEffect(()=>{
    dbService.getAllPost().then((newPosts)=>{
      if(newPosts)
        setPosts(newPosts.documents)

    })
  },[])

  const userPosts = posts.filter((item) => userData && item.userId === userData.$id);
  return (
    <div className=' px-10 p-[20px]  '>
      <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}>
        <Masonry gutter="20px">
        {userPosts.length > 0 ? (
            userPosts.map((item) => (
              <div key={item.$id} className=''>
                <PostPreview {...item} />
              </div>
            ))
          ) : (
            <div className=' font-dolce text-2xl'>
              Want to <Link to="/add-post" className='underline hover:rounded-3xl hover:bg-black hover:text-white py-3 px-4'>add a post?</Link>
            </div>
          )}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  )
}

export default MyPosts
