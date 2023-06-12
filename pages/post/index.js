import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import style from "../../styles/Comment.module.css";
import CommentSection from '@/Component/CommentSection';
import Comment from '@/Component/Comment';
const fetcher = (url) => fetch(url).then((res) => res.json());
const Post = () => {
    const { data:comments, mutate } = useSWR('interactive-comments-backend-production.up.railway.app/api/v1/user', fetcher);
    const { data:CurrentUser, error} = useSWR('interactive-comments-backend-production.up.railway.app/api/v1/user/username/juliusomo', fetcher);
    const [users,setUser] = useState(comments);
    const [current,setCurrent] = useState(CurrentUser);
    const [type,setType] = useState(1);
    const [edit,isEdit] = useState(0);
    const [reply,isReplying] = useState(0);
    useEffect(()=>{
        setUser(comments);
        setCurrent(CurrentUser)
       console.log(CurrentUser);
    },[comments,CurrentUser])
    if (!comments) return <div>loading...</div>

  return (
    //<Comment type={type} setType={setType} isReply={false} user={user}/>
    <div  className='bg-primary bg-opacity-10 p-3'>
            <div >
            {
                users?.map((user,key)=>{
                    return(
                        <div key={key}>
                            <Comment reply={reply} current={current} isReplying={isReplying} edit={edit} isEdit={isEdit} type={3} setType={setType} isReply={false} user={user}/>
                            {
                                user.reply.map((r,key)=>{
                                    return(
                                        <div key={key}>
                                            <Comment current={current} reply={reply} isReplying={isReplying} edit={edit} isEdit={isEdit} type={3} setType={setType} isReply={true} user={r}/>
                                        </div>
                                    
                                    );
                                })
                            }
                        </div>
                    
                    );

                    
                })
                
            }      
            <CommentSection current={current} type={1} mutate={mutate}/>
        </div>
    </div>
   
  )
}

export default Post;
