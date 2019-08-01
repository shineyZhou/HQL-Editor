  (function(){
		var ace_text_layer=document.querySelector('.ace_text-layer'); /**文本元素*/
		var ace_cursor=document.querySelector('.ace_cursor'); /**光标元素*/
		var ace_text_input=document.getElementsByClassName('ace_text-input')[0]; /**textarea框*/
		var dataJson={
		data: [{
			src_ip: '172.16.150.23',
			}, 
			{
			src_port: 80,
			},
			{
			dst_ip: '172.16.150.23'
		},
		{
			dst_port: 81,
		
		}
		]
		};	 
	var dataFields=[];
	function isInArray(arr,val){
		//值是否在数组中
		var isExist=false;
		arr.forEach(function(elem,ind){
			if(elem==val){
				isExist=true;
			}
		});
		return isExist;
		
	}
	function initTextarea(){               
		var dataArr=dataJson.data;
		var len=dataArr.length;
		
		for(var i=0; i<len; i++){
			var ace_line_Elem=document.createElement('div');
			ace_line_Elem.className="ace_line";
			ace_line_Elem.style.top=i*14+'px';
			var data=dataArr[i];
			var str='<span class="bracketColor">(</span>';
			for(var key in data){
				var val=data[key];
				var type=(typeof val).toLocaleLowerCase();
				var filedClass="";
				var valueStr="";
				if(!isInArray(dataFields,key)){
					//如果不存在字段数组中则push
					dataFields.push(key);
				}
				
				if(type=="string"){
					filedClass="strFiledColor";/**字符串类型字段样式样式*/
					valueStr='<span class="valueColor">"'+val+'"</span>';
				}else if(type=='number'){
					filedClass="numFiledColor";/**数值类型字段样式样式*/
					valueStr='<span class="valueColor">'+val+'</span>';
				}
				var filedStr='<span class="'+filedClass+'">'+key+'</span>';                       
				str+=filedStr+'<span class="condOprColor">=</span>'+valueStr+'<span class="bracketColor">)</span>';
			}
			ace_line_Elem.innerHTML=str;
			ace_text_layer.appendChild(ace_line_Elem);
		}
		
	}
	initTextarea();/**初始化赋值textarea*/
	
		window.onload=function(){
			//页面加载完之后textarea获得焦点  	
			ace_text_input.focus();
		}
	
		ace_text_input.addEventListener('input',function(event){
			var val=ace_text_input.value;  
			
			/**计算文本框所在的行*/
			var top=window.getComputedStyle(ace_text_input).top.replace('px','');
		var txtLeft=Number(window.getComputedStyle(ace_text_input).left.replace('px',''));
			//获得文本框所在行对应的ace_line;  		
			var dy_ace_line_Elem=getAceLineOrCreate(top);
			var beforeDy_ace_lineW=getLineLengthForSetLeft(dy_ace_line_Elem);/**以前对应的行宽 */
			var dy_ace_line_class=dy_ace_line_Elem.className;
			var spanElems=dy_ace_line_Elem.getElementsByTagName('span');
			var spansLen=spanElems.length;		
									
				if(spansLen>0){            	   
						var cursorSpanInfo=getSpanCursorDy();
						oprValAtDySpanElem(dy_ace_line_Elem,cursorSpanInfo,val);
								//spanLen>0完
				}else{  
					if(dy_ace_line_class.indexOf('enter_line')>-1 && val.match(/\s+/g)!=null){
						val="";
					}
					var span=createdySpan(val);		  		   
						dy_ace_line_Elem.appendChild(span);	
				}
			
		
		ace_text_input.value=""; 
		
		var nowDy_ace_lineW=getLineLengthForSetLeft(dy_ace_line_Elem);/**现在对应的行宽 */
		var dis=nowDy_ace_lineW-beforeDy_ace_lineW; /**差值看做是新增字符产生的宽 */
		var left=txtLeft+dis; 
			ace_text_input.style.left=left+'px';
			ace_cursor.style.left=left+'px';
			
		},false);
	ace_text_input.addEventListener('focus',function(){
			//获得焦点，光标增加闪烁样式
			var ace_cursor_layer=ace_cursor.parentNode;
			ace_cursor_layer.classList.add('ace_smooth-blinking');
			ace_cursor_layer.classList.add('ace_animate-blinking');
			ace_cursor_layer.classList.remove('ace_hidden-cursors');
		},false);
		ace_text_input.addEventListener('blur',function(){
			//获得焦点，光标增加闪烁样式
			var ace_cursor_layer=ace_cursor.parentNode;
			ace_cursor_layer.classList.remove('ace_smooth-blinking');
			ace_cursor_layer.classList.remove('ace_animate-blinking');
			ace_cursor_layer.classList.add('ace_hidden-cursors');
		},false);
		function  getStrLen(str){
		//获得字符串的长度，包括汉子
			return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
	}
	
		function getSpanCursorDy(){
			//获得光标所对应的span
		
			var top=window.getComputedStyle(ace_text_input).top.replace('px','');
			var txtLeft=Number(window.getComputedStyle(ace_text_input).left.replace('px',''));
			//获得文本框所在行对应的ace_line;  		
			var dy_ace_line_Elem=getAceLineOrCreate(top);
			var spanElems=dy_ace_line_Elem.getElementsByTagName('span');
			var spansLen=spanElems.length;	
			var pos=-1,characterPos=0;
			var curSpanElem;
		
			for(var i=0; i<spansLen;i++){
				var spanElem=spanElems[i];
				if(i<spansLen-1){
				var sLeft=spanElem.offsetLeft;
				var snLeft=spanElems[i+1].offsetLeft;
				if(txtLeft>=sLeft && txtLeft<=snLeft){
					pos=i;
					break;
				}
				}else if(i==spansLen-1){
					//最后一个元素
					var slLeft=spanElem.offsetLeft;
					var slw=spanElem.offsetWidth;
					if(txtLeft>=slLeft && txtLeft<=(slLeft+slw)){
					pos=i;
					}
				}
			
			
			}
		
		var  curSpanElem=spanElems[pos];
		if(curSpanElem!=undefined){
			var  curSpanLeft=curSpanElem.offsetLeft;
			var curSpanw=curSpanElem.offsetWidth;
			
			var strLen=getStrLen(curSpanElem.innerHTML); /*当前span的字符串长度 */
			var characterW=curSpanw/strLen; /**当前span每个字符的平均长度*/
			characterPos=Math.ceil((txtLeft-curSpanLeft)/characterW);
		}	 
		
			return {cursorSpan:curSpanElem,characterPos:characterPos}	
		}
		function createdySpan(val){
			/**如果是特殊符号，则创建新的符号*/
			var span=document.createElement('span');
		span.textContent=val;
		if(val.match(/\s+/g)!=null){
			span.className="space";
		}else{
			if(val=="(" || val==")"){  
						span.className="bracketColor";
					}else if(val==">" || val=="<" || val=="=" || val==">=" || val=="<="){
						span.className="condOprColor";
					}else{
						//否则创建新的标志
						span.className="identifier";
					}
			}
		return span;
	
		};
	
		function oprValAtDySpanElem(dy_ace_line_Elem,cursorSpanInfo,val){
		
			var spanElem=cursorSpanInfo.cursorSpan;     
			if(spanElem!=undefined){
				var characterPos=cursorSpanInfo.characterPos;
				
				var spanClassName=spanElem.className;	  
				
				if(val.match(/\s+/g)!=null){
					/**空字符*/
					if(spanClassName=="space" || (spanClassName=="valueColor" && isNaN(spanElem.innerHTML))){	
						/**拼接空格 */				
						var identifierStr=spanElem.innerHTML;
						var fStr=identifierStr.slice(0,characterPos)+val+identifierStr.slice(characterPos);
						spanElem.innerHTML=fStr;
					}else{
						/**需要创建新的空格元素 */
						var span=document.createElement('span');
							span.textContent=val;
						span.className="space";
						var spanNextElem=spanElem.nextSibling;
						
						//如果插入的空格在字符创之中
						if(spanClassName=="strFiledColor" || spanClassName=="numFiledColor" || (spanClassName=="valueColor" && !isNaN(spanElem.innerHTML))){
							//如果是字符串字段名
							var identifierStr=spanElem.innerHTML;
							var beforeSpanNode=document.createElement('span');
							var bfText=document.createTextNode(identifierStr.slice(0,characterPos));
							beforeSpanNode.appendChild(bfText);
							beforeSpanNode.className=spanClassName=="valueColor" ? "valueColor": "identifier";	/**如果是字符串类型的值 */
							var afStr=identifierStr.slice(characterPos);							
							var afSpanNode=document.createElement('span');	
							var isDataBaseField=isInArray(dataFields,afStr); /**看是否是数据库字段 */
							var fClassName=isDataBaseField? spanClassName:'otherFieldColor'; /**如果是数据库字段则加上对应的数据库字段颜色，如果不是加上其他字段颜色 */
							var afText=	document.createTextNode(afStr);	
							afSpanNode.appendChild(afText);					
							afSpanNode.className=spanClassName=="valueColor" ? "identifier" :fClassName;
							dy_ace_line_Elem.insertBefore(afSpanNode,spanNextElem);
							dy_ace_line_Elem.insertBefore(span,spanNextElem.previousSibling);
							dy_ace_line_Elem.insertBefore(beforeSpanNode,spanNextElem.previousSibling.previousSibling);
							dy_ace_line_Elem.removeChild(spanElem); /**移除以前本身的字段名元素 */
						}else{
							if(spanNextElem){ 	
								if(spanElem.isSameNode(dy_ace_line_Elem.firstElementChild)){
									if(characterPos>0){
										dy_ace_line_Elem.insertBefore(span,spanNextElem);
									}else{
										dy_ace_line_Elem.insertBefore(span,spanElem);
									}
								}else{
									dy_ace_line_Elem.insertBefore(span,spanNextElem);
								}					
								
							}else{
								dy_ace_line_Elem.appendChild(span);
							}
						}
						
					}
				}else if(val==">" || val=="<" || val=="="){ /**条件运算符*/
					if(spanClassName=="condOprColor"){
						var identifierStr=spanElem.innerHTML;
						var fStr=identifierStr.slice(0,characterPos)+val+identifierStr.slice(characterPos);
						spanElem.innerHTML=fStr;
					}else{
						var span=document.createElement('span');
							span.textContent=val;
						span.className="condOprColor";
						dy_ace_line_Elem.appendChild(span);
	
					}
				}else if(val=="(" || val==")"){ /**括号*/
					if(spanClassName=="bracketColor"){
							var identifierStr=spanElem.innerHTML;
							if(val==identifierStr){								
							var fStr=identifierStr.slice(0,characterPos)+val+identifierStr.slice(characterPos);
							spanElem.innerHTML=fStr;
							}else{
								var newSpanElem=createdySpan(val);
								console.log('---characterPos',characterPos);
								if(characterPos>0){
									console.log(spanElem.nextSibling)
									if(spanElem.nextSibling){
										dy_ace_line_Elem.insertBefore(newSpanElem,spanElem.nextSibling);
									}else{
										console.log(newSpanElem);
										dy_ace_line_Elem.appendChild(newSpanElem);
									}
								}else{
									dy_ace_line_Elem.insertBefore(newSpanElem,spanElem);
								}
							}
					}else{
						var span=document.createElement('span');
							span.textContent=val;
						span.className="bracketColor";
						dy_ace_line_Elem.appendChild(span);
	
					} /**括号完*/
				}else{
					
						if(spanClassName=="identifier" ){
								var identifierStr=spanElem.innerHTML;
							
								var fStr=identifierStr.slice(0,characterPos)+val+identifierStr.slice(characterPos);
												
								spanElem.innerHTML=fStr;
								if(fStr=="and" || fStr=="or" || fStr=="not"){
									spanElem.className="keyColor";
								}	
	
							}else if(spanClassName=="valueColor"){
							
								var identifierStr=spanElem.innerHTML;
								var fStr=identifierStr.slice(0,characterPos)+val+identifierStr.slice(characterPos);						
								/**寻找字段元素 */
								var prevElem=spanElem.previousSibling;
								var prevElemClassName=prevElem.className;
									
								
								while(prevElem && (prevElemClassName!='strFiledColor' && prevElemClassName!='numFiledColor' && prevElemClassName!='otherFieldColor' && prevElemClassName!='identifier')){
									prevElem=prevElem.previousSibling;
								
									console.log(prevElem);
									prevElemClassName=prevElem.className;
								}
								spanElem.innerHTML=fStr;
							
									var isNumber=isNaN(fStr);	
									if(isNumber){
										//值是字符串
										prevElem.className="strFiledColor";
									}else{
										//值是数字				                     	
										prevElem.className="numFiledColor";
									}
							
									
							
							}else if(spanClassName=="strFiledColor" || spanClassName=="numFiledColor"){
								var identifierStr=spanElem.innerHTML;
								var fStr=identifierStr.slice(0,characterPos)+val+identifierStr.slice(characterPos);
								
								var isDataBaseField=isInArray(dataFields,fStr); /**看是否是数据库字段 */
								var newClassName=isDataBaseField ? spanClassName:'otherFieldColor';
								
								spanElem.className=newClassName;
								spanElem.innerHTML=fStr;
							}else if( spanClassName=="otherFieldColor"){
								var identifierStr=spanElem.innerHTML;
								var fStr=identifierStr.slice(0,characterPos)+val+identifierStr.slice(characterPos);
								
								var isDataBaseField=isInArray(dataFields,fStr); /**看是否是数据库字段 */
								var newClassName=spanClassName;
								if(isDataBaseField){
									//如果是数据库字段，则得到它下级的子元素，判断子类型
									var nextElem=spanElem.nextSibling;
									var nextElemClassName=nextElem.className;
								
									while(nextElem && nextElemClassName!='valueColor'){
										
											nextElem=nextElem.nextSibling;
											nextElemClassName=nextElem.className;
									
										
									}
									var value=nextElem.innerHTML;
									
									if(isNaN(value)){
										newClassName="strFiledColor";
									}else{
										newClassName="numFiledColor";
									}
	
								}
								spanElem.className=newClassName;
								spanElem.innerHTML=fStr;
							}else if(spanClassName=="keyColor"){
								/**如果当前span为关键字元素*/
								var identifierStr=spanElem.innerHTML;
								var fStr=identifierStr.slice(0,characterPos)+val+identifierStr.slice(characterPos);
								spanElem.innerHTML=fStr;
								spanElem.className="identifier";
							}else if(spanClassName=="bracketColor"){
								/**if(spanElem.isSameNode(dy_ace_line_Elem.firstElementChild)){
									 //当前节点是否是它的第一个节点
									var newSpanElem=createdySpan(val);
									dy_ace_line_Elem.insertBefore(newSpanElem,spanElem);
								}else{
									var spanPrevElem=spanElem.previousSibling; /**当前节点的上一个节点 */
							/*}*/
								var newSpanElem=createdySpan(val);
							
								if(characterPos>0){
								
									if(spanElem.nextSibling){
										dy_ace_line_Elem.insertBefore(newSpanElem,spanElem.nextSibling);
									}else{
									
										dy_ace_line_Elem.appendChild(newSpanElem);
									}
								}else{
									dy_ace_line_Elem.insertBefore(newSpanElem,spanElem);
								}
							}else{
								var span=document.createElement('span');
								span.textContent=val;
								if(spanClassName=="condOprColor"){
									span.className="valueColor";
								}else{
									span.className="identifier";
								}
							
								var spanNextElem=spanElem.nextSibling;
								if(spanNextElem){ 								
									dy_ace_line_Elem.insertBefore(span,spanNextElem);
								}else{
									dy_ace_line_Elem.appendChild(span);
								}
							}
				}
		}else{
			var spanElem=createdySpan(val);
			dy_ace_line_Elem.insertBefore(spanElem,dy_ace_line_Elem.firstElementChild);
		}  
	
		}
		function oprSpanElem(spanElem){
			var spanClassName=spanElem.className;
			var fStr=spanElem.innerHTML;
			if(spanClassName=="valueColor"){
				/**寻找字段元素 */
				var prevElem=spanElem.previousSibling;
				var prevElemClassName=prevElem.className;					
				while(prevElem && (prevElemClassName!='strFiledColor' && prevElemClassName!='numFiledColor' && prevElemClassName!='otherFieldColor' && prevElemClassName!='identifier')){
					prevElem=prevElem.previousSibling;
					prevElemClassName=prevElem.className;
				}
				var isNumber=isNaN(fStr);	
				if(isNumber){
					//值是字符串
					prevElem.className="strFiledColor";
				}else{
					//值是数字				                     	
					prevElem.className="numFiledColor";
				}
				// valueColor span元素完
			}else if(spanClassName=="strFiledColor" || spanClassName=="numFiledColor"){
				
				var isDataBaseField=isInArray(dataFields,fStr); /**看是否是数据库字段 */
				var newClassName=isDataBaseField ? spanClassName:'otherFieldColor';
				spanElem.className=newClassName;
	
			}else if( spanClassName=="otherFieldColor"){
				var isDataBaseField=isInArray(dataFields,fStr); /**看是否是数据库字段 */
				var newClassName=spanClassName;
				if(isDataBaseField){
					//如果是数据库字段，则得到它下级的子元素，判断子类型
					var nextElem=spanElem.nextSibling;
					var nextElemClassName=nextElem.className;
				
					while(nextElem && nextElemClassName!='valueColor'){
						nextElem=nextElem.nextSibling;
						nextElemClassName=nextElem.className;
					}
					var value=nextElem.innerHTML;
					if(isNaN(value)){
						newClassName="strFiledColor";
					}else{
						newClassName="numFiledColor";
					}
	
				}
				spanElem.className=newClassName;	
				//otherField span元素完			
		}
		}
		document.getElementById('txt-editor').addEventListener('keydown',function(event){
			//监听键盘事件
			var rcts=this.getBoundingClientRect();  	
			var ev=event || window.event;
		
			var keyCode=ev.keyCode;  
		//获得文本框的高度
		var ace_text_input=document.querySelector('.ace_text-input');
		var txtTop=Number(window.getComputedStyle(ace_text_input).top.replace('px',''));
		var txtLeft=Number(window.getComputedStyle(ace_text_input).left.replace('px',''));
		var lineHeight=14;
	
			if(keyCode==8){
				//如果是回退键 Backspace
				
			//获得文本框所在行对应的ace_line;  		
			var dy_ace_line_Elem=getAceLine(txtTop);
			
			if(dy_ace_line_Elem!=undefined){
				//如果对应的行存在,获得该行所在的文本
				var cursorSpanInfo=getSpanCursorDy();
				var beforeW=getLineLengthForSetLeft(dy_ace_line_Elem); /**以前该行的宽度*/
				var cursorSpan=cursorSpanInfo.cursorSpan;
				
				var characterPos=cursorSpanInfo.characterPos;
				var spanStr=cursorSpan.innerHTML;	      
				var fStr=spanStr.slice(0,characterPos-1)+spanStr.slice(characterPos);
				if(fStr==""){
					dy_ace_line_Elem.removeChild(cursorSpan);
					var childElementCount=dy_ace_line_Elem.childElementCount; /**该行子元素的个数*/
					if(childElementCount==0){
						//如果为0,则移除该行
						dy_ace_line_Elem.parentNode.removeChild(dy_ace_line_Elem);
					

					}
				}else{
					cursorSpan.innerHTML=fStr;
					oprSpanElem(cursorSpan);/**根据该span操作相应的元素，主要是改变类名 */
					
					
				}
				//获得改行所对应的字符串长度
				var newW=getLineLengthForSetLeft(dy_ace_line_Elem); /**现在该行的宽度*/
				var dis=beforeW-newW;
				var fLeft=txtLeft-dis+'px'
				ace_text_input.style.left=fLeft;
				ace_cursor.style.left=fLeft;
			}else{
				var tTop=txtTop-14;
				if(tTop>=0){
				 var pre_ace_line_Elem=getAceLine(tTop);
				 if(pre_ace_line_Elem!=undefined){
					var prevWidth=getLineLengthForSetLeft(pre_ace_line_Elem); /**获得对应行所在的字符串长度*/
					ace_text_input.style.top=tTop+'px';
					ace_cursor.style.top=tTop+'px';
					ace_text_input.style.left=prevWidth+'px';
					ace_cursor.style.left=prevWidth+'px';
				 }
				 	
				}

			}
			
			}else if(keyCode==13){
				//enter键
				
				if(txtTop<=70){
				var sTop=txtTop+lineHeight;
				
					var dy_ace_line_Elem=getAceLineOrCreate(sTop,'enter_line'); 
	
					var left=getLineLengthForSetLeft(dy_ace_line_Elem); 
					
	
				ace_text_input.style.left=left+'px';
				ace_text_input.style.top=sTop+'px';
				ace_cursor.style.left=left+'px';
				ace_cursor.style.top=sTop+'px';
				ace_text_input.focus();
				}
				
	
			}else if(keyCode==37){
				/**按了键盘的左移ArrowLeft箭头*/
				
				txtLeft-=7;
				//var rctsLeft=rcts.left;
				if(txtLeft<0) txtLeft=0;  		
				ace_text_input.style.left=txtLeft+'px';
				ace_cursor.style.left=txtLeft+'px';
			}else if(keyCode==38){
			/**按了键盘的上移ArrowUp箭头*/  		
				txtTop-=14;
				var rctsTop=0;
				if(txtTop<rctsTop) txtTop=rctsTop;
				
			ace_text_input.style.top=txtTop+'px';
			ace_cursor.style.top=txtTop+'px';
			var dy_ace_line_Elem=getAceLine(txtTop); /**获得该top值对应所在的行*/
			
			var strWidth=getLineLengthForSetLeft(dy_ace_line_Elem); /**获得对应行所在的字符串长度*/
			if(txtLeft>strWidth) txtLeft=strWidth;
				ace_text_input.style.left=txtLeft+'px';
				ace_cursor.style.left=txtLeft+'px';
			}else if(keyCode==39){
			/**按了键盘的右移ArrowRight箭头*/  		
				txtLeft+=7;
				var rctsRight=rcts.right;
				if(txtLeft>rctsRight) txtLeft=rctsRight;        
			ace_text_input.style.left=txtLeft+'px';
			ace_cursor.style.left=txtLeft+'px';
			}else if(keyCode==40){
				/**按了键盘的右移ArrowDown箭头*/  		 
				txtTop+=14;
				var rctsHeight=rcts.height-14-2;
				if(txtTop>rctsHeight) txtTop=rctsHeight;
	
				var dy_ace_line_Elem=getAceLine(txtTop); /**获得该top值对应所在的行*/
			
				if(dy_ace_line_Elem!=undefined){
					//下面存在行才进行下移等操作
					
					ace_text_input.style.top=txtTop+'px';
					ace_cursor.style.top=txtTop+'px';
					var strWidth=getLineLengthForSetLeft(dy_ace_line_Elem); /**获得对应行所在的字符串长度*/
				if(txtLeft>strWidth) txtLeft=strWidth;
				ace_text_input.style.left=txtLeft+'px';
				ace_cursor.style.left=txtLeft+'px';
				}
				
			}else if(keyCode==46){
				//按了delete键
				var dy_ace_line_Elem=getAceLine(txtTop);
				if(dy_ace_line_Elem!=undefined){
				
						var cursorSpanInfo=getSpanCursorDy();		 
					var cursorSpan=cursorSpanInfo.cursorSpan;
					var characterPos=cursorSpanInfo.characterPos;				
					var spanStr=cursorSpan.innerHTML;			
					if(cursorSpan.className=='space'){
						//cursorSpan
					}      
				
					var fStr=spanStr.slice(0,characterPos)+spanStr.slice(characterPos+1);
				
					if(fStr==""){
						dy_ace_line_Elem.removeChild(cursorSpan);
						var childElementCount=dy_ace_line_Elem.childElementCount; /**该行子元素的个数*/
						if(childElementCount==0){
							//如果为0,则移除该行
							dy_ace_line_Elem.parentNode.removeChild(dy_ace_line_Elem);
							var ace_line_elems=document.getElementsByClassName('ace_line');
							var ace_elems_len=ace_line_elems.length;
							for(var i=0; i<ace_elems_len; i++){
									var ace_elem=ace_line_elems[i];
									var ace_top=ace_elem.style.top.replace('px','');
									ace_elem.style.top=(ace_top-14)+'px';
							}
						}
					}else{
						cursorSpan.innerHTML=fStr;
						oprSpanElem(cursorSpan);/**根据该span操作相应的元素，主要是改变类名 */
					}
				}//if完
				//keyCode==46完
			}
	
		},false);
	document.getElementById('txt-editor').addEventListener('click',function(event){
		var editor=this;
		var height=window.getComputedStyle(editor).height.replace('px','');
		var lineHeight=14;/**定义行高为14像素*/
		var num=height/lineHeight;   
		var ace_text_input=document.querySelector('.ace_text-input');
		var ev=event || window.event; 	
		var target=ev.target || ev.srcElement; 	 
			if(target.className.indexOf('ace_text-input')>-1){
				//如果target是文本框，则返回不进行操作
				return;
			}
		var ox=event.offsetX;
		var oy=event.offsetY;
		var lineth=Math.floor(oy/14); 
		
		if(lineth>=0 && lineth<num){	
			var top=lineth*14;
		
			var dy_ace_line_Elem=getAceLineOrCreate(top);
			var ace_len_w=getLineLengthForSetLeft(dy_ace_line_Elem);	 	
			var left=Math.min(ox,ace_len_w);        
			ace_text_input.style.left=left+'px';
			ace_text_input.style.top=top+'px';
			ace_cursor.style.left=left+'px';
			ace_cursor.style.top=top+'px';
			ace_text_input.focus();
			
	}
		
	},false);
	function getAceLine(top){
		var ace_lines=document.getElementsByClassName('ace_line');
		var ace_lines_len=ace_lines.length;	 
		var dy_ace_line_Elem;
		for(var i=0; i<ace_lines_len; i++){
				var ace_line_elem=ace_lines[i];
				var itemTop=window.getComputedStyle(ace_line_elem).top.replace('px','');
				if(itemTop==top){ 		 
					dy_ace_line_Elem=ace_line_elem;
					break;
				}
		}
		return dy_ace_line_Elem;	
	}
	//返回对应行
	function getAceLineOrCreate(top,specialClass){
		var dy_ace_line_Elem=getAceLine(top);
		specialClass=specialClass || "";
		if(!dy_ace_line_Elem){
			/**如果不存在则添加元素*/
			var newLineElem=document.createElement('div');
			newLineElem.className="ace_line "+specialClass;
			newLineElem.style.top=top+'px';
			dy_ace_line_Elem=newLineElem;
			ace_text_layer.appendChild(newLineElem);
		}
		return dy_ace_line_Elem;
	}
	//根据对应行返回所在行的字符串长度
	function getLineLengthForSetLeft(dy_ace_line_Elem){
			var spanElems=dy_ace_line_Elem.getElementsByTagName('span');
			var spansLen=spanElems.length;
				var spanWSum=0;
			if(spansLen>0){
	
					for(var i=0; i<spansLen; i++){
					var spanElem=spanElems[i];
					spanWSum+=spanElem.offsetWidth;
				}
			}
			var left=spanWSum;
			return left;
	}
  
  })()  
  