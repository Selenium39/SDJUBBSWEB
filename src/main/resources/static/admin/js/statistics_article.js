var URL = 'http://localhost:8080';
var name = $.cookie('name');
var sessionId = $.cookie(name);
$(function () {
    paperSetting()
});

function paperSetting() {
    show();
}

function show() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));

    // 指定图表的配置项和数据
    option = {
        title: {
            text: '文章统计',
        },
        xAxis: {
            type: 'category',
            data: (function () {
                var datas = [];
                $.ajax({
                    type: "get",
                    url: URL + '/api/admin/statistics/article/info?num=5',
                    async: false,
                    data: {
                        name: '' + name,
                        sessionId: '' + sessionId,
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (result) {
                        console.log(result.data.infos)
                        $.each(result.data.infos, function (index,info) {
                            datas.push(info.title);
                        });
                    }
                })
                return datas;
            })(),
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {}
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: (function () {
                var datas = [];
                $.ajax({
                    type: "get",
                    url: URL + '/api/admin/statistics/article/info?num=5',
                    async: false,
                    data: {
                        name: '' + name,
                        sessionId: '' + sessionId,
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (result) {
                        $.each(result.data.infos, function (index,info) {
                            datas.push(info.seeNum);
                        });
                    }
                })
                return datas;
            })(),
            type: 'bar',
            label: { //显示柱状图上的数值
                show: true,
                position: 'top',
                textStyle:{
                    color: 'black',
                    fontSize: 12
                }
            },
            barWidth: '50%',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(220, 220, 220, 0.8)'
            }
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}




