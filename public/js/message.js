$(function(){

	var arr = [];
	var currentPage = 20;
	verifyEvent();
	message();
	$(".pager .number").text(currentPage);	

	// 获取数据
	function message(){
		var data = {
			page : currentPage,
			pageSize : 6
		}
		$.get("http://120.78.164.247:8099/manager/article/findArticle",data,getMess);
	}
	// 把数据渲染到页面
	function getMess(result){
		if(result.data){
			$(".alert").fadeOut();
			var html = template('mess-tm', result.data);
			$('#mess-table').html(html);
		}else{
			$(".alert").fadeIn();
		}
	}
	// 翻页
	$(".pager .previous").click(function(){
		currentPage--;
		numberTB();
	})
	$(".pager .next").click(function(){
		currentPage++;
		numberTB();
	})
	function numberTB(){
		if(currentPage>0 && currentPage<35){
			$(".pager .number").text(currentPage);
			message();
			console.log("当前页",currentPage,"后台问题");
		}
	}
	//修改
	$("table").on("click","i.change",function(){
		$('#mymodal').modal("show");
		$(".md-title").text("修改资讯信息");
		var id = $(this).parents("td").data("id");
		var parentId = $(this).parents("td").data("lu-id");
		var $parent = $(this).parents("tr");
		getModalData(parentId);
		$("select").data("id",id);
		$("#lm-name").val($parent.find("td:eq(1)").text());
		$("#music").val($parent.find("td:eq(3)").text());
	})
	// 删除
	$("table").on("click","i.delete",function(){
		var id = $(this).parents("td").data("id");
		$.get("http://120.78.164.247:8099/manager/article/deleteArticleById",{id:id},function(){
			message();
			tipsAnimate($(".dele-tips"),"删除成功");
		})
	})
	// 批量删除
	$(".dele-mun").click(function(){
		var $check = $("tbody tr:not(:first) :checked");
		if($check.length){
			var dataId = [];
			for(var i = 0 , len = $check.length ; i < len ; i++){
				var id = $check.eq(i).parents("td").nextAll("td:last").data("id");
				dataId.push(id);
			}
			var data = {
				ids: dataId.toString()
			}
			$.post("http://120.78.164.247:8099/manager/article/batchDeleteArticle",data,function(){
				message();
				tipsAnimate($(".dele-tips"),"删除成功");
			});
		}else{
			tipsAnimate($(".dele-tips"),"请选择内容");
		}
	});
	// 提示弹出框
	function tipsAnimate(ele,text){
		ele.find("span").text(text);
		ele.fadeIn(500,function(){
			setTimeout(function(){
				ele.fadeOut(500);
			},500)
		});
	}

	// 全选
	$("th:first").click(function(){
		$(this).toggleClass("all");
		if($(this).hasClass("all")){
			$("input[type='checkbox']").prop("checked",true);
		}else{
			$("input[type='checkbox']").prop("checked",false);
		}
	})

	// 非空
	function require(ele){
		if(!ele.val()){
			ele.prev().addClass("warning");
			return 0;
		}else{
			ele.prev().removeClass("warning");
			return 1;
		}
	}
	// 模态框显示 获取所属栏目
	$('#mymodal').on('show.bs.modal',getModalData);
	function getModalData(parentId){
		$.get("http://120.78.164.247:8099/manager/category/findAllCategory",function(result){
			var data = result.data;
			$("select").children(":not(:first)").remove();
			for(var i in data){
				var select = data[i].id==parentId?"selected":"";
				var $opt = $("<option value='"+data[i].id+"' "+select+">"+
								data[i].name+"</option>");
				$("select").append($opt);
			}
		});
	}
	// 清空模态框内容
	$('#mymodal').on('hide.bs.modal',function(){
		$("#add-user").get(0).reset();
		$(".modal-body p").removeClass("warning");
		$("select").removeData("id");
		$(".list-style>div").removeClass("select");
	});
	// 表单验证
	function verifyEvent(){
		$("#lm-name").blur(function(){
			arr[0] = require($(this));
		})
		$("#cnt").blur(function(){
			var reg = /[\w\W]{8,}/
			if(!reg.test($(this).val())){
				arr[1] = -1;
				$(this).prev().addClass("warning");
			}else{
				arr[1] = 1;
				$(this).prev().removeClass("warning");
			}
		})
	}
	// 列表样式选择
	$(".list-style>div").click(function(){
		$(this).toggleClass("select");
		$(this).siblings().removeClass("select");
	})
	// 发布资讯
	$("button.add").click(function(){
		$(".md-title").text("发布资讯");
	})
	$("#add-confirm").click(addMessage);
	function addMessage(){
		var id = $("select").data("id");
		var listStyle = $(".list-style>div.select").index(".list-style>div");
		if(id){
			var key = true;
		}else{
			var key = arr.every(function(item,index,arr){
				return item > 0;
			})
			if(!arr.length){
				$("#lm-name").blur();
				$("#cnt").blur();
				key = false;
			}
		}
		if($("select option:selected").index()>0){
			var parent = $("option:selected").val();
		}
		if(key){
			var dataAdd = {
				id: id,
				title: $("#lm-name").val(),
				categoryId: $(":selected").val(),
				music: $("#music").val(),
				liststyle: listStyle,
				content: $("#cnt").val(),
				readtimes: 1,
				publishtime: new Date().toLocaleString()
			}
			$.post("http://120.78.164.247:8099/manager/article/saveOrUpdateArticle",dataAdd,function(){
				message();
				$('#mymodal').modal('hide');
				var text = id?"修改成功":"发布成功";
				tipsAnimate($(".dele-tips"),text);
			})
		}
	}

})
