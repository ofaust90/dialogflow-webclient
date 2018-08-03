
		var accessToken = "YOUR_TOKEN";
		var baseUrl = "https://api.api.ai/v1/";

		$(document).ready(function() {
			$("#input").keypress(function(event) {
				if (event.which == 13) {
					event.preventDefault();
					setInputText();
					send($("#input").val());
				}
			});
			$("#rec").click(function(event) {
				switchRecognition();
			});
			
			$("#send").click(function(event) {
				setInputText();
				send($("#input").val());
			});
		});

		/* NOT USED IN THIS CASE
		var recognition;

		function startRecognition() {
			recognition = new webkitSpeechRecognition();
			recognition.onstart = function(event) {
				updateRec();
			};
			recognition.onresult = function(event) {
				var text = "";
			    for (var i = event.resultIndex; i < event.results.length; ++i) {
			    	text += event.results[i][0].transcript;
			    }
			    setInput(text);
				stopRecognition();
			};
			recognition.onend = function() {
				stopRecognition();
			};
			recognition.lang = "en-US";
			recognition.start();
		}
	
		function stopRecognition() {
			if (recognition) {
				recognition.stop();
				recognition = null;
			}
			updateRec();
		}
		
		function switchRecognition() {
			if (recognition) {
				stopRecognition();
			} else {
				startRecognition();
			}
		}
		
		function updateRec() {
			$("#rec").text(recognition ? "Stop" : "Speak");
		}

		*/
		function setInput(text) {
			$("#input").val(text);
			send();
		}

		

		
		function sendBtn(e){
			
			console.log(this);
			var postback = $(this).attr("data-postback");
			console.log(postback);
			send(postback);
		}
		
		function send(text) {
		
			$.ajax({
				type: "POST",
				url: baseUrl + "query?v=20150910",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + accessToken
				},
				data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),

				success: function(data) {
					setResponse(JSON.stringify(data, undefined, 2));
					
					setResponseText(data.result.fulfillment.messages);
					
				},
				error: function() {
					setResponse("Internal Server Error");
				}
			});
			setResponse("Loading...");
		}

		function setResponse(val) {
			$("#response").text(val);
			
						
			
		}
		
		function setResponseText(messages){
			
			
			
			$(messages).each(function(index,element){
				
				
				if(element.type == 0){
					$("#chat").text($("#chat").text() + "- " + element.speech +"\r\n");
					
					$("#responseTable >tbody").append("<tr><td class='server-response'><div class='alert alert-success pull-right'>"+element.speech+"</td></tr>");	
				}else if(element.type == 4){
					
					var trElement = $("<tr><td class='server-response'><div class='alert alert-success pull-right'></td></tr>");
					
					
					if(element.payload.buttons == undefined){
		
					var button = "<button class='btn btn-primary' data-postback="+element.payload.postback+">"+element.payload.text+"</button>";
					$("#responseTable >tbody").append("<tr><td class='server-response'><div class='alert alert-success pull-right'>"+button+"</td></tr>");
					}else{
						
						var buttons = element.payload.buttons;
						var tr = $("<tr></tr>");
						var btnHtml = "";
						$(buttons).each(function(index,element){
							
						
							var button = "<button   class='btn btn-primary' data-postback="+element.postback+">"+element.text+"</button>";
						
							var btnEl = $(button);
						
						
							btnEl.click(  sendBtn );
							
							
						    btnHtml += button +"<br>";
						    trElement.find('div').append(btnEl);
						    trElement.find('div').append("<br>");
						}) 
					
						$("#responseTable >tbody").append(trElement);
					}
				}
				
			});
			
			
			var table = $("#responseTable").height();
			var lastRow = $("#responseTable >tbody >tr ").last(); 
			var pos = lastRow.offset().top ;
			console.log(pos);
			
			console.log(lastRow.find("div").text());
			
			$("#responseTable").animate({
				scrollTop: pos
			},500);
			
			$("#input").val("");
		}
		
				
		function setInputText(){
			var inputText = $("#input").val();
			$("#chat").text($("#chat").text() +"+ " +inputText +"\r\n");
			$("#responseTable >tbody").append("<tr><td class='user-request'><div class='alert alert-info'>"+inputText+"</div></td></tr>");
		}
		
		
		