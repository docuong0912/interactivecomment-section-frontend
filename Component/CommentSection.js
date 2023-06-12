import React, { useEffect, useRef } from 'react'
import style from '../styles/Comment.module.css';
import Image from 'next/image';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';
const CommentSection = ({current,type,id,isEdit,isReplying}) => {

  const [comment,setComment] = useState("");
    const inputRef = useRef();

  const handleComment = async ()=>{
    const response = await fetch(`https://interactive-comments-backend-production.up.railway.app/api/v1/user/comment/add`,{
        method:'POST',
        body:JSON.stringify({
            "content":comment
        }),
        headers:{
            'Content-Type':'application/json'
        }
    });
    const data = await response.json();
    inputRef.current.value="";
    return Odata=>[...Odata,data];
   
}
const handleReply = async ()=>{
    const response = await fetch(`https://interactive-comments-backend-production.up.railway.app/api/v1/user/comment/reply/${id}`,{
        method:'POST',
        body:JSON.stringify({
            "content":comment
        }),
        headers:{
            'Content-Type':'application/json'
        }
    });
    const data = await response.json();
    isReplying(0);
    inputRef.current.value="";
    return Odata=>[...Odata,data];
   
}
const handleUpdate = async()=>{
      const response = await fetch(`https://interactive-comments-backend-production.up.railway.app/api/v1/user/updateComment/${id}?body=${comment}`,{
          method:'PUT',
      });
      isEdit(0);
      inputRef.current.value="";
      return comments=> [...comments];
  
    
}
const {trigger} = useSWRMutation("http://localhost:8080/api/v1/user",type==1?handleComment:type==2?handleUpdate:handleReply,{validate:true});
  return (
    <div className={`container p-3 d-lg-flex justify-content-between align-items-start pb-4 ${type!=1?"col-lg-7":"col-lg-7"}  col-11 mt-3 bg-white ${style.commentArea}`}>
        <textarea ref={inputRef} maxLength={200}  rows={3} onChange={(e)=>setComment(e.target.value)} className={`form-control-lg  col-lg-8 w-sm-100 order-2`} type='text'/> 
        
        {current?.imageUrl &&<Image className='order-1' src={current?.imageUrl} width={35} height={35} alt='user avatar'/> }  
        <button onClick={trigger} className={`order-3 btn btn-primary col-4 col-lg-2 btn-lg ${style.sendBtn}`}>{type == 1?"send":type==2?"update":"reply"}</button>
        
    </div>
  )
}

export default CommentSection;
