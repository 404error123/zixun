$(function(){
	var arr = [];
	verifyEvent();
	user();

	// 状态切换
	$(".user-list").on("click",".dot-move",function(){
		var id = $(this).data("id");
		var bool = $(this).hasClass("open")?false:true;
		var _this = $(this);
		if(id){
			$.post("http://120.78.164.247:8099/manager/user/changeStatus",{id:id,status:bool},function(){
				_this.toggleClass("open");
			})
		}
	})
	// 获取用户
	function user(){
		$.get("http://120.78.164.247:8099/manager/user/findAllUser",getUser)
	}
	function getUser(result){
		var html = template('user-tm', result);
		$('#user-box').html(html);
	}
	// 表单验证
	function verifyEvent(){
		$("#us-name").blur(function(){
			arr[0] = require($(this));
		})
		$("#pwd").blur(function(){
			arr[1] = require($(this));
		})
		$("#real-name").blur(function(){
			arr[2] = require($(this));
		})
		$("#repwd").blur(function(){
			if(!$(this).val()){
				$(this).prev().addClass("warning");
				arr[3] = 0;
			}else{
				if($(this).val() != $("#pwd").val()){
					$(this).prev().addClass("warning");
					arr[3] = 0;
				}else{
					$(this).prev().removeClass("warning");
					arr[3] = 1;
				}
			}
		})
		$("#email").blur(function(){
			var reg = /^\w+@\w+(\.\w{2,6})+$/
			if(reg.test($(this).val())){
				$(this).prev().removeClass("warning");
				arr[4] = 1;
			}else{
				$(this).prev().addClass("warning");
				arr[4] = 0;
			}
		});
	}
	function require(ele){
		if(!ele.val()){
			ele.prev().addClass("warning");
			return 0;
		}else{
			ele.prev().removeClass("warning");
			return 1;
		}
	}
	// 上传头像图片
	$("#head-url").on("change",function(){
		var formData = new FormData();
		var file = this.files[0];
		formData.append("file",file);
		$.ajax({
		    url: 'http://120.78.164.247:8099/manager/file/upload',
		    type: 'POST',
		    cache: false,
		    data: formData,
		    processData: false,
		    contentType: false,
		    success: function(request){
		    	var url = "http://39.108.81.60:8888/" + request.data.groupname +"/"+ request.data.id;
		    	$("#head-url").data("url",url);
		    }
		})
	})
	// 增加用户
	$(".btn-box>button.push").click(function(){
		$('#mymodal').find("h4").text("添加用户");
	});
	$("#add-confirm").click(addUser);
	function addUser(){
		var id = $(this).data("id");
		var status = $(".modal-body :checked").val()=="开启"?true:false;
		if(id){
			var key = true;	
		}else{
			var key = arr.every(function(item,index,arr){
				return item > 0;
			})
			if(!arr.length){
				$("#us-name").blur();
				$("#pwd").blur();
				$("#real-name").blur();
				$("#repwd").blur();
				$("#email").blur();
				key = false;
			}
		}
		if(key){
			var data = {
				id: id,
			    username: $("#us-name").val(),
			    password: $("#pwd").val(),
			    nickname: $("#real-name").val(),
			    enabled: status,
			    email: $("#email").val(),
			    userface : $("#head-url").data("url")
			}
			$.post("http://120.78.164.247:8099/manager/user/saveOrUpdateUser",data,function(){
				user();
				$('#mymodal').modal('hide');
				var text = id?"修改成功":"增加成功";
				tipsAnimate(text);
			})
		}
	}
	// 清空模态框内容、警告样式
	$('#mymodal').on('hide.bs.modal',function(){
		$("#us-name").val("");
		$("#pwd").val("");
		$("#real-name").val("");
		$("#repwd").val("");
		$("#email").val("");
		$(".modal-body p").removeClass("warning");
		$("#add-confirm").removeData("id");
		$("#head-url").removeData("url").val("");
		$("label #op").prop("checked",true);
	});
	// 查找用户
	$(".btn-search").click(findColumn);
	function findColumn(){
		var cnt = $(".form-control").val().trim();
		if(cnt){
			var name = {
				username: cnt
			}
			$.get("http://120.78.164.247:8099/manager/user/findUserByUsername",name,function(result){
				$(".user-list").empty();
				if(result.data){
					getUser({data:[result.data]});
					tipsAnimate("查询成功");
				}else{
					tipsAnimate("未查询到该用户");
				}
			})
		}else{
			user();
			tipsAnimate("查询成功");
		}
	}
	// 提示框
	function tipsAnimate(text){
		$(".dele-tips").find("span").text(text);
		$(".dele-tips").fadeIn(500,function(){
			setTimeout(function(){
				$(".dele-tips").fadeOut(800);
			},500)
		});
	}
	// 删除用户
	$(".user-list").on("click","button.delete",function(){
		var id = {
			id: $(this).data("id")
		}
		$.get("http://120.78.164.247:8099/manager/user/deleteUserById",id,function(){
			user();
			tipsAnimate("用户删除成功");
		})
	})
	// 修改用户信息
	$(".user-list").on("click","button.change",function(){
		$('#mymodal').modal("show").addClass("cd-user").find("h4").text("修改用户信息");
		var $parent = $(this).parents(".list-cnt");
		$("#us-name").val($parent.find("#user-name").text());
		$("#real-name").val($parent.find("#real-name").text());
		$("#email").val($parent.find("#email").text());
		$("#head-url").data("url",$parent.find("img").prop("src"));
		if($parent.find(".dot-move").hasClass("open")){
			$("label #op").prop("checked",true);
		}else{
			$("label #cl").prop("checked",true);
		}
		$("#add-confirm").data("id",$(this).next().data("id"))
		$("#pwd").val($(this).data("no"));
	})

})