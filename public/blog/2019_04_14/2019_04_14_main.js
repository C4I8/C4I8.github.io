var _2019_04_14 = {}
function start() {
	var header = document.getElementById('header');
	var out_content = document.getElementById('out_content');
	var content = document.getElementById('content');
	var footer = document.getElementById('footer');
	_2019_04_14.header = header;
	_2019_04_14.out_content = out_content;
	_2019_04_14.content= content;
	_2019_04_14.footer = footer;
	initLayout();
	document.body.onresize = initLayout;
}
function initLayout() {
	var _ = _2019_04_14;
	if(_.header.offsetHeight + _.out_content.offsetHeight < window.innerHeight){
		_.content.style.height = window.innerHeight - _.header.offsetHeight - _.footer.offsetHeight + 'px';
	}
}