import React, { useEffect } from 'react';
import { useState,useRef } from 'react';
import style from '../styles/Comment.module.css';
import Image from 'next/image';
import CommentSection from './CommentSection';
import { mutate } from 'swr';
const Comment = ({isReplying,reply,user,setType,isReply,edit,isEdit,current}) => {
    const [score,setScore] = useState(user.score);
    const btn = useRef([]);
    const [prevScore,setPrev] = useState(0);

    const hanldeScore = async (plus)=>{
        const response = await fetch(`https://interactive-comments-backend-production.up.railway.app/api/v1/user/updateScore/${user.id}?isPlus=${plus}&&prevScore=${prevScore}`,{
            method:'PUT'
        });
        const data = await response.json();
        setScore(data);
        if(plus){
            setPrev(1);
            localStorage.setItem(`btnId-${user.id}`,btn.current[user.id-1].id);
         }
         else{
             setPrev(-1);
             localStorage.setItem(`btnId-${user.id}`,btn.current[user.id-1].id);
         }
       
    }
    const handleDelete = ()=>{
        mutate(`http://localhost:8080/api/v1/user`,async (comments)=>{
            const response = await fetch(`https://interactive-comments-backend-production.up.railway.app/api/v1/user/comment/delete/${user.id}`,{
                method:'DELETE'
            })
            return [...comments];
        },{revalidate:true})
    }
  
    return(
        < div className={`container mt-3 ${style.comment} ${isReply?style.reply:""} ${isReply?"col-11":""} col-lg-9 `}key={user.username}>
           <div className={` position-relative ${isReply?"ms-2 col-12 col-lg-10 ":""} ${style.innerComment} m-auto col-lg-9 bg-white`}>
           <div>
               <div className={`${user.username==current?.username?"col-lg-6":"col-lg-5 "} col-11 d-flex justify-content-between align-items-center`}>
                    <Image style={{borderRadius:'50%'}} src={user.imageUrl} width={30} height={30} alt='avatar'/>
                   <b>{user.username}</b>
                   {user.username==current?.username?<div className='d-flex justify-content-center align-items-center bg-primary text-white col-lg-3'>you</div>:""}
                   <p className={`text-secondary text-center m-0 ${style.period}`}> {user.period<60?"just now" :user.period<3600?`${Math.floor(user.period/60)} minute ago`:user.period<86400?`${Math.floor(user.period/3600)} hour ago`:user.period<604800?`${Math.floor(user.period/3600/24)} day ago`:user.period<2419200?`${Math.floor(user.period/3600/24/4)} week ago`:user.period<58060800?`${Math.floor(user.period/3600/24/30)} month ago`:""}</p>
               </div>
               
           </div>
           <div>
               
                   
                       
             <div >
                <p className='d-inline text-primary'>{user.replyTo!=null?`@${user.replyTo}`:""}</p> 
               <p className={`${style.textArea} text-secondary d-inline ms-1`}>{user.content}</p>
               
              
              </div>

           </div>
           <div className='d-flex justify-content-between '>
               <div className={`d-flex justify-content-between align-items-center col-4  bg-secondary bg-opacity-10 ${style.scoreContainer}`}>
                   <button id={`btnUp-${user.id}`} ref={e=>btn.current[user.id-1]=e} onClick={()=>hanldeScore(true)} className='btn bg-tranparent  btn-outline-* btn-sm'>+</button>
                   <p className=' align-self-center m-0'>{score}</p>
                   <button id={`btnDown-${user.id}`} ref={e=>btn.current[user.id-1]=e} onClick={()=>hanldeScore(false)} className='btn bg-tranparent  btn-outline-* btn-sm'>-</button>
               </div>
              
              
               {user.username=='juliusomo'
               ?
                <div className={`${style.modifyBlock} col-lg-4 d-flex justify-content-between align-items-center `}>
                    <button onClick={handleDelete} className='d-flex justify-content-around align-items-center col-lg-5 btn text-danger btn-sm'><Image src="/images/icon-delete.svg" width={10} height={10} alt='delete btn'/>Delete</button>
                    <button onClick={()=>isEdit(user.id)} className='d-flex justify-content-around align-items-center btn text-primary  btn-sm col-lg-5'><Image src="/images/icon-edit.svg" width={10} height={10} alt='edit btn'/>Edit</button>
                    
                
                </div>
                :
                <button onClick={()=>isReplying(user.id)} className={`col-3 d-flex justify-content-around align-items-center col-lg-2 btn btn-sm ${style.replyBtn}`}><Image src="/images/icon-reply.svg" width={10} height={10} alt='reply button'/><b>Reply</b></button>
            }
               
           </div>
           
           </div>
           {edit==user.id?<CommentSection user={current} isEdit={isEdit} isReplying={isReplying} type={2} setType={setType}  id={user.id} />:""}
           {reply==user.id?<CommentSection user={current}  isEdit={isEdit} isReplying={isReplying}  type={3} setType={setType} isReply={isReply} id={user.id}/>:""}
   </div>
   )
}

export default Comment
