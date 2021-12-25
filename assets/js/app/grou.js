$(document).ready(function () {
    var table;
    dt =  $("#kt_datatable").DataTable({
    processing: true,
    serverSide: true,
    ajax: "/admin/grou/query",
    columns:[
{data:"uid"},
{data:"name"},
{data:"intro"},
{data:"route"},
{data:"icon"},
{data:"child"},
{data:"bound_uid"},
{ data: null }
    ],
    columnDefs:[
{
    targets: -1,
    data: null,
    orderable: false,
    className:'text-end',
    render: function (data, type, row) {
    return `
                            <a href="#" class="btn btn-light btn-active-light-primary btn-sm" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                                操作
                                <span class="svg-icon svg-icon-5 m-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <polygon points="0 0 24 0 24 24 0 24"></polygon>
                                            <path d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z" fill="#000000" fill-rule="nonzero" transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999)"></path>
                                        </g>
                                    </svg>
                                </span>
                            </a>
                            <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4" data-kt-menu="true">
                                <div class="menu-item px-3">
                                    <a href="#" class="menu-link px-3" data-kt-docs-table-filter="editor_row">
                                        编辑
                                    </a>
                                </div>
                                <div class="menu-item px-3">
                                    <a href="#" class="menu-link px-3" data-kt-docs-table-filter="delete_row">
                                        删除
                                    </a>
                                </div>
                            </div>
                        `;
},
},
{
    targets: 4,
    orderable: true,
    className: "huanhang",
}
    ],
    language: {
    "sProcessing": "处理中...",
    "sLengthMenu": "显示 _MENU_ 项结果",
    "sZeroRecords": "没有匹配结果",
    "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
    "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
    "sInfoPostFix": "",
    "sSearch": "搜索:",
    "sUrl": "",
    "sEmptyTable": "表中数据为空",
    "sLoadingRecords": "载入中...",
    "sInfoThousands": ",",
    "oPaginate": {
    "sFirst": "首页",
    "sPrevious": "上页",
    "sNext": "下页",
    "sLast": "末页"
},
    "oAria": {
    "sSortAscending": ": 以升序排列此列",
    "sSortDescending": ": 以降序排列此列"
}
},
});

    dt.on('draw', function () {
    handleDeleteRows();
    EditorUser();
    KTMenu.createInstances();
});

    var handleDeleteRows = () => {
    const deleteButtons = document.querySelectorAll('[data-kt-docs-table-filter="delete_row"]');
    deleteButtons.forEach(d => {
    d.addEventListener('click', function (e) {
    e.preventDefault();
    const parent = e.target.closest('tr');
    const customerName = parent.querySelectorAll('td')[0].innerText;
    Swal.fire({
    text: "确认要删除UID为 " + customerName + "的分组?",
    icon: "warning",
    showCancelButton: true,
    buttonsStyling: false,
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    customClass: {
    confirmButton: "btn fw-bold btn-danger",
    cancelButton: "btn fw-bold btn-active-light-primary"
}
}).then(function (result) {
    if (result.value) {
    $.ajax({
    type:"POST",
    url:"/admin/grou/delete",
    data:{uid:customerName},
    success:function (msg) {
    console.log(msg);
    if(msg.code == 200){
    Swal.fire({
    text: "成功删除UID为 " + customerName + "的分组!.",
    icon: "success",
    buttonsStyling: false,
    confirmButtonText: "删除成功!",
    customClass: {
    confirmButton: "btn fw-bold btn-primary",
}
}).then(function () {
    dt.draw();
    return true;
});
}else{
    Swal.fire({
    icon: 'error',
    title: msg.msg,
    showConfirmButton: false,
    timer: 1500
})
    return false;
}
}
});
} else if (result.dismiss === 'cancel') {
    Swal.fire({
    text: "IUD:"+customerName + "已被取消删除",
    icon: "error",
    buttonsStyling: false,
    confirmButtonText: "确认",
    customClass: {
    confirmButton: "btn fw-bold btn-primary",
}
});
}
});
})
});
}

    var EditorUser = function (){
    const t = document.getElementById("kt_modal_editor_user"),e = t.querySelector("#kt_modal_editor_user_form"),
    m=document.querySelectorAll('[data-kt-docs-table-filter="editor_row"]'),n = new bootstrap.Modal(t);
    m.forEach(d =>{
    d.addEventListener('click',function (f) {
    f.preventDefault();
    n.show('kt_modal_editor_user');
    const parent = f.target.closest('tr'),uid = parent.querySelectorAll('td')[0].innerText,name_x = parent.querySelectorAll('td')[1].innerText,intro_x = parent.querySelectorAll('td')[2].innerText,route_x = parent.querySelectorAll('td')[3].innerText,icon_x = parent.querySelectorAll('td')[4].innerText,child_x = parent.querySelectorAll('td')[5].innerText,bound_uid_x = parent.querySelectorAll('td')[6].innerText;
    $("input[name='editor_name']").val(name_x),$("input[name='editor_intro']").val(intro_x),$("input[name='editor_route']").val(route_x),$("input[name='editor_icon']").val(icon_x);
    set_select_checked("editor_child",child_x);
    set_select_checked("editor_bound_uid",bound_uid_x);
    t.querySelector('[data-kt-users-modal-action="close"]').addEventListener("click",(t =>{
    n.hide();
}));
    t.querySelector('[data-kt-users-modal-action="cancel"]').addEventListener("click",(t=>{
    t.preventDefault();
    Swal.fire({
    text: "您确定要取消吗?",
    icon: "warning",
    showCancelButton: !0,
    buttonsStyling: !1,
    confirmButtonText: "是的",
    cancelButtonText: "不要",
    customClass: {confirmButton: "btn btn-primary", cancelButton: "btn btn-active-light"}
}).then((function (t) {
    t.value ? (e.reset(),n.hide()):'return false';
}));
}))
    const o = t.querySelector('[data-kt-users-modal-action="submit"]');
    o.addEventListener("click",(function (t) {
    t.preventDefault();
    let name = $("input[name='editor_name']").val(),intro = $("input[name='editor_intro']").val(),route = $("input[name='editor_route']").val(),
    icon = $("input[name='editor_icon']").val(),child = $("select[name='user_child'] option:selected").val(),bound_uid = $("select[name='user_bound_uid'] option:selected").val();
    o.setAttribute("data-kt-indicator", "on");
    o.disabled = !0;
    setTimeout((function () {
    o.removeAttribute("data-kt-indicator");
    o.disabled =! 1;
    $.ajax({
    url:"/admin/grou/edi",
    type:"POST",
    dataTable:"json",
    data:{uid:uid,name:name,intro:intro,route:route,icon:icon,child:child,bound_uid:bound_uid},
    success:function (data) {
    if(data.code == 200){
    return Swal.fire({
    text: "恭喜修改成功",
    icon: "success",
    buttonsStyling: !1,
    confirmButtonText: "Ok, got it!",
    customClass: {confirmButton: "btn btn-primary"}
}).then((function (t) {
    t.isConfirmed && n.hide();
    location.reload();
}))
}else{
    return Swal.fire({
    text: data.msg,
    icon: "error",
    buttonsStyling: !1,
    confirmButtonText: "好的",
    customClass: {confirmButton: "btn btn-primary"}
})}
},
    error:function () {
    return Swal.fire({
    text: "链接失败",
    icon: "error",
    buttonsStyling: !1,
    confirmButtonText: "好的",
    customClass: {confirmButton: "btn btn-primary"}
})
}
})
}),1000)
}))
})
})
}

    var AddUser = function () {
    const t = document.getElementById("kt_modal_add_user"),e = t.querySelector("#kt_modal_add_user_form"),
    n = new bootstrap.Modal(t);
    return {
    init:function () {
    (() => {
    var o = FormValidation.formValidation(e, {
    fields: {
    user_name: {validators: {notEmpty: {message: "请填写正确的名称"}}},
    user_intro: {validators: {notEmpty: {message: "请填写介绍"}}},
    user_route: {validators: {notEmpty: {message: "请填写路由"}}},
    user_icon: {validators: {notEmpty: {message: "请填写图标"}}},
    user_child: {validators: {notEmpty: {message: "请选择分组级别"}}},
    user_bound_uid: {validators: {notEmpty: {message: "请选择绑定分组"}}},
},
    plugins: {
    trigger: new FormValidation.plugins.Trigger,
    bootstrap: new FormValidation.plugins.Bootstrap5({
    rowSelector: ".fv-row",
    eleInvalidClass: "",
    eleValidClass: ""
})
}
});
    const i = t.querySelector('[data-kt-users-modal-action="submit"]');
    i.addEventListener("click", (t => {
    t.preventDefault(), o && o.validate().then((function (t) {
    "Valid" == t ? (i.setAttribute("data-kt-indicator", "on"), i.disabled = !0, setTimeout((function () {
    const name = $("input[name='user_name']").val(),intro = $("input[name='user_intro']").val(),route = $("input[name='user_route']").val(),icon = $("input[name='user_icon']").val(),
    child = $("select[name='user_child'] option:selected").val(),bound_uid = $("select[name='user_bound_uid'] option:selected").val();
    i.removeAttribute("data-kt-indicator"), i.disabled = !1,
    $.ajax({
    url:"/admin/grou/add",
    type:"POST",
    dataTable:"json",
    data:{name:name,intro:intro,route:route,icon:icon,child:child,bound_uid:bound_uid},
    success:function (data) {
    if(data.code == 200){
    Swal.fire({
    text: "添加成功",
    icon: "success",
    buttonsStyling: !1,
    confirmButtonText: "好的",
    customClass: {confirmButton: "btn btn-primary"}
}).then((function (t) {
    t.isConfirmed && n.hide();
    location.reload();
}));
}else if(data.code == 101){
    Swal.fire({
    text: data.msg,
    icon: "error",
    buttonsStyling: !1,
    confirmButtonText: "好的",
    customClass: {confirmButton: "btn btn-primary"}
})
}
}
});
}), 2e3)) : Swal.fire({
    text: "有未输入的选项，请重新输入",
    icon: "error",
    buttonsStyling: !1,
    confirmButtonText: "好的",
    customClass: {confirmButton: "btn btn-primary"}
})
}))
})), t.querySelector('[data-kt-users-modal-action="cancel"]').addEventListener("click", (t => {
    t.preventDefault(), Swal.fire({
    text: "您确定要取消吗?",
    icon: "warning",
    showCancelButton: !0,
    buttonsStyling: !1,
    confirmButtonText: "确认",
    cancelButtonText: "不",
    customClass: {confirmButton: "btn btn-primary", cancelButton: "btn btn-active-light"}
}).then((function (t) {
    t.value ? (e.reset(),n.hide()):'return false';
}))
})), t.querySelector('[data-kt-users-modal-action="close"]').addEventListener("click", (t => {
    n.hide();
}))
})()
}
}
}();
    /**
     * 设置select控件选中
     * @param selectId select的id值
     * @param checkValue 选中option的值
     */
    function set_select_checked(selectId, checkValue){
    var select = document.getElementById(selectId);

    for (var i = 0; i < select.options.length; i++){
    if (select.options[i].value == checkValue){
    select.options[i].selected = true;
    break;
}
}
}
    KTUtil.onDOMContentLoaded((function () {
    AddUser.init();
}));
});