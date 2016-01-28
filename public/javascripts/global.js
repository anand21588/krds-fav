// Functions =============================================================
var List = function () {};

List.prototype._busy = false;

List.prototype.id_link = 0;

List.prototype.validate = function (id)
{
	var _this = this;
	try
	{
		if ($.trim($('#favorite_name_' + id).val()).length === 0)
			throw{msg: 'Fill the Favorites'};

		if ($.trim($('#url_' + id).val()).length === 0)
			throw{msg: 'Fill the url'};

		return true;
	}
	catch (e)
	{
		_this.error('#js_error_' + id, e.msg);
		return false;
	}
};

List.prototype.insertData = function (id)
{
	var _this = this;

	if (_this._busy || !_this.validate(id))
		return false;
	
	var data = {};
	data._id = id;
	data.name = $('#favorite_name_' + id).val();
	data.url = $('#url_' + id).val();
	
	if(_this.id_link > 0)
		data.id = _this.id_link;

	$.post('/users/save', data).done(function (response)
	{
		console.log(response);
	});
};

List.prototype.validateCategory = function (id)
{
	var _this = this;
	
	try
	{
		if ($.trim($('#category_name').val()).length === 0)
			throw{msg: 'Fill the Category'};

		return true;
	}
	catch (e)
	{
		_this.error('#js_error', e.msg);
		return false;
	}
};

List.prototype.insertCategory = function ()
{
	var _this = this;

	if (_this._busy || !_this.validateCategory())
		return false;

	$.post('/users/saveCategory', {name: $('#category_name').val()}).done(function (response)
	{
		if(response._id)
		{
			$('#category_name').val('');
			$('.close').click();
		}
	});
};

List.prototype.deleteFav = function (_id, id)
{
	var _this = this;

	if (_this._busy)
		return false;

	$.post('/users/deleteFav', {_id: _id, id: id}).done(function (response)
	{
		console.log(response);
	});
};

List.prototype.error = function (ele, msg)
{
	$(ele).hide(0);
	$(ele).html(msg).show(0).delay(5000).hide(0);
};

var list = new List();

// DOM Ready =============================================================
$(document).ready(function ()
{
	$('.category').each(function ()
	{
		var highestBox = 0;

		if ($(this).height() > highestBox)
			highestBox = $(this).height();

		$('.category').height(highestBox);
	});

	$('#wrapper').delegate('#add, #close', 'click', function ()
	{
		$('#form_block, #add').toggle();
		return false;
	});

	$('.listOfForms').submit(function ()
	{
		list.insertData($(this).data('id'));
		return false;
	});

	$('#category_form').submit(function ()
	{
		list.insertCategory();
		return false;
	});
	
	$('.deleteFav').click(function(e)
	{
		e.preventDefault();
		list.deleteFav($(this).data('_id'), $(this).data('id'));
		return false;
	});

	$('.addFavorites, .close, .editFav').click(function (e) 
	{
		e.preventDefault();
		var id = $(this).data('_id'), name = $(this).data('name'), url = $(this).data('url');
		list.id_link = $(this).data('id_link');
		
		if(typeof name != 'undefined' && typeof url != 'undefined')
		{
			$('#favorite_name_'+id).val(name); 
			$('#url_'+id).val(url);
		}
		else
		{
			$('#favorite_name_'+id).val(''); 
			$('#url_'+id).val('');
		}
			
		$('#forms_' + id + ', #category_' + id).toggle();
		return false;
	});
});

