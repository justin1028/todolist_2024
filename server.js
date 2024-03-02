//D:\code\todolist  檔案在此
//初始測試先用console.log確認環境是否正常
//console.log ("hello");

const http =require('http');
const { v4: uuidv4 } = require('uuid');

const errorHandle = require('./errorHandle');
      
const todos =[];

const requestListner =(req,res)=>{
    const headers = {
   'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json;charset=utf-8' 
}

let body="";
req.on('data',chunk=>{
     // console.log(chunk);
    body+=chunk;
})

      


     if(req.url=="/todos" && req.method =="GET"){
       res.writeHead(200,headers);
    
       res.write(JSON.stringify({
                "status":"success",
                "data":todos
       }));

           //透過 res.end() 可以把想要給瀏覽器的回應寫在這裡
           res.end();
     }
     else if(req.url=="/todos" && req.method =="POST"){
       //req.on('end', function) 處理接收完的行為。
       //資料接收完後 寫入todos
       req.on('end',()=>{
           try{
                const title =JSON.parse(body).title;
                if (title !== undefined){
                 // console.log (title);
                    const todo ={
                          "title":title,
                           "id":uuidv4()
                    };
                    todos.push(todo);       
                    res.writeHead(200,headers);       
                    res.write(JSON.stringify({
                         "status":"success",
                         "data":todos
                    })); 
                    res.end();  
                 }
                else {
                   
                      errorHandle(res)
                     }
             }catch(error){
              
                errorHandle(res)
              }
         })       
      }
     else if(req.url=="/todos" && req.method =="DELETE"){
     //留意此段不用呼叫req.on(） 有網址就可以直接刪除
               todos.length=0; //將陣列清為0
               res.writeHead(200,headers);       
               res.write(JSON.stringify({
               "status":"success",
               "data":todos
               })); 
            res.end();

     }

     else if(req.url.startsWith("/todos/") && req.method =="DELETE"){
   
           console.log('刪除單筆代辦');
              const id =req.url.split("/").pop();
             //  console.log(id);
              const index = todos.findIndex(element => element.id==id);
               //  console.log(index);
              //    console.log( element);
                if (index!==-1){
                    todos.splice(index,1);
                    res.writeHead(200,headers);       
                    res.write(JSON.stringify({
                    "status":"success",
                    "data":todos
                    })); 
                    res.end();  
                 } else{
                   errorHandle(res);
                 }
            }
     
      else if(req.url.startsWith("/todos/") && req.method =="PATCH"){
            req.on('end',()=>{
                try{
                     const todo = JSON.parse(body).title;
                     const id = req.url.split('/').pop();
                     const index = todos.findIndex(element=>element.id ==id );
                     console.log(todo,id,index);
                       console.log(index);
                     if (todo !== undefined && index !== -1){
                        todos[index].title = todo;
                        res.writeHead(200,headers);       
                        res.write(JSON.stringify({
                                 "status":"success",
                                 "data":todos
                       })); 
                    res.end();  


                     }
                     else {
                         errorHandle(res);
                     }

                     
                }catch{
                     errorHandle(res);
                }

            })

       }       

     else if( req.method =="OPTIONS"){
       res.writeHead(200,headers);
           //透過 res.end() 可以把想要給瀏覽器的回應寫在這裡
      res.end('Delete Success');
     }
     else{
        console.log(req.url);
       console.log(req.method);
         res.writeHead(404,headers);
         res.write(JSON.stringify({
                "status":"false",
                "message":"無此網站路由082",
       }));
      res.end();
     }
  
}

const server = http.createServer(requestListner);
//啟動並監聽伺服器
server.listen(process.env.PORT||3005);

//測試方式 終端機打 node server.js
//http://localhost:3005/ 確認有無出現Hello
