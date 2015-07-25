/**
 * Created by WXF on 2015/7/18.
 */

//var ButtonToolbar = ReactBootstrap.ButtonToolbar,
//    Button = ReactBootstrap.Button;

var initDataLoaded = false;
var dataLoaded = false;

var imgPath = "../assets/img/";

// 报告容器
var ReportBody = React.createClass({
    getInitialState: function() {
        return {data: [], initData: {}};
    },
    componentDidMount: function() {
        this.loadInitData();
        this.loadData();
    },
    // 加载初始化数据，如页面标题等
    loadInitData: function() {
        $.ajax({
            url: this.props.initUrl,
            dataType: 'json',
            cache: false,
            success: function(data) {
                initDataLoaded = true;
                this.setState({initData: data});
            }.bind(this),
            error: function(xhr, status, err) {
                //console.error(this.props.initUrl, status, err.toString());
            }.bind(this)
        });
    },
    // 加载页面数据
    loadData: function() {
        $.ajax({
            url: this.props.dataUrl,
            dataType: 'json',
            cache: false,
            success: function(data) {
                dataLoaded = true;
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                //console.error(this.props.initUrl, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div className="reportBody">
                {/* 报告标题 */}
                <ReportHeader initData={this.state.initData} reportScore={this.state.data.reportScore} />
                {/* 报告副标题 */}
                <ReportSubHeader initData={this.state.initData} reportAnnotation={this.state.data.annotation} />
                {/* 报告序言 */}
                <ReportPreface initData={this.state.initData} />
                {/* 报告结论 */}
                <ReportResult initData={this.state.initData} reportResult={this.state.data.result} />
                {/* 报告目录 */}
                <ReportMenu initData={this.state.initData} />
                {/* 报告内容 */}
                <ReportContent initData={this.state.initData} data={this.state.data} />
                {/* 附录 */}
                <ReportAppendix initData={this.state.initData} download={this.state.data.download} />
            </div>
        )
    }
});

// 报告标题
var ReportHeader = React.createClass({
    render: function() {
        return (
            <div className="reportHeader">
                <img className="logo" src={imgPath + "giant_logo_analysis.png"}/>
                <span className="title">{this.props.initData.title}</span>
                <div className="score">
                    <span>总体评分：</span><img className="reportScore" src={imgPath + this.props.reportScore + ".png"}/>
                </div>
            </div>
        )
    }
});

// 报告副标题
var ReportSubHeader = React.createClass({
    render: function() {
        return (
            <div className="reportSubHeader">
                <div className="intro">{this.props.initData.intro}</div>
                <div className="annotation">{this.props.reportAnnotation}</div>
            </div>
        )
    }
});



// 内容块卡片头
var ReportCardHeader = React.createClass({
    render: function() {
        return (
            <div className="reportCardHeader">
                {this.props.title}
            </div>
        )
    }
});
// 分段内容
var SegContent = React.createClass({
    render: function() {
        // 标题
        var content_header = "";
        if (undefined != this.props.header) {
            var sub_content_header = (
                <div className="pageHeader">
                    {this.props.header}
                </div>
            );
            if (undefined != this.props.headerAnchor) {
                content_header = (
                    <a className="menuLink" href={"#" + this.props.headerAnchor}>
                        {sub_content_header}
                    </a>
                )
            } else {
                content_header = sub_content_header;
            }
        }
        // 标题重点
        var content_em = "";
        if (undefined != this.props.em) {
            content_em = (
                <div className="pageHeaderEm">{this.props.em}</div>
            )
        }
        // 内容
        var content = "";
        if (undefined != this.props.content) {
            content = (
                <pre className="pageContent">
                    {this.props.content}
                </pre>
            )
        }
        return (
            <div className="segContent">
                {content_header}
                {content_em}
                {content}
            </div>
        )
    }
});

// 序言
var ReportPreface = React.createClass({
    render: function() {
        if (initDataLoaded) {
            var prefaceNodes = this.props.initData.preface_list.map(function (prefaceItem, key) {
                return (
                    <SegContent header={prefaceItem.title} content={prefaceItem.content} key={key}/>
                );
            });
        }

        return (
            <div className="reportCard reportPreface">
                <ReportCardHeader title={this.props.initData.preface} />
                <div className="reportCardBody">
                    {prefaceNodes}
                </div>
            </div>
        )
    }
});

// 结论与建议
var ReportResult = React.createClass({
    render: function() {
        if (initDataLoaded && dataLoaded) {
            reportResult = this.props.reportResult;
            var resultNodes = this.props.initData.result_list.map(function (resultItem, key) {
                return (
                    <SegContent header={resultItem.title} content={reportResult[key].content} em={reportResult[key].em} key={key}/>
                );
            });
        }

        return (
            <div className="reportCard reportResult">
                <ReportCardHeader title={this.props.initData.result} />
                <div className="reportCardBody">
                    {resultNodes}
                </div>
            </div>
        )
    }
});

// 目录
var ReportMenu = React.createClass({
    render: function() {
        if (initDataLoaded) {
            var menuNodes = this.props.initData.menu_list.map(function (menuItem, key) {
                return (
                    <SegContent header={menuItem} headerAnchor={"menu_"+key} key={key}/>
                );
            });
        }

        return (
            <div className="reportCard reportMenu">
                <ReportCardHeader title={this.props.initData.menu} />
                <div className="reportCardBody">
                    {menuNodes}
                </div>
            </div>
        )
    }
});

// 附录
var ReportAppendix = React.createClass({
    render: function() {
        return (
            <div className="reportCard reportAppendix">
                <ReportCardHeader title={this.props.initData.appendix} />
                <div className="reportCardBody reportCardBodyAppendix">
                    <div>本报告所涉及原始数据:</div>
                    <a href={this.props.download}><div>下载</div></a>
                </div>
            </div>
        )
    }
});






// 内容分段标题
var ContentPageHeader = React.createClass({
    render: function() {
        var menuItem = undefined == this.props.menuItem ? "" : this.props.menuItem;
        return (
            <div id={this.props.id} className={"contentPageHeader" + " " + "contentScore_" + this.props.score}>
                {menuItem}
                <div className="score">
                    <span>该项得分：</span><img className="reportScore" src={imgPath + this.props.score + ".png"}/>
                </div>
            </div>
        )
    }
});

// 内容分段标题重点
var ContentPageHeaderEm = React.createClass({
    render: function() {
        var emItem = undefined == this.props.emItem ? "" : this.props.emItem;
        return (
            <div className="contentPageHeaderEm">
                {this.props.emItem}
            </div>
        )
    }
});

// 内容分段子标题
var ContentSubPageHeader = React.createClass({
    render: function() {
        var subMenuItem = undefined == this.props.subMenuItem ? "" : this.props.subMenuItem;
        var subMenuItemAnnotation = undefined == this.props.subMenuItemAnnotation ? "" : this.props.subMenuItemAnnotation;
        return (
            <div className="contentSubPageHeader">
                <span className="title">{subMenuItem}</span><span className="annotation">{subMenuItemAnnotation}</span>
            </div>
        )
    }
});
// 内容分段段落
var ContentSubPageP = React.createClass({
    render: function() {
        var subPageP = undefined == this.props.subPageP ? "" : this.props.subPageP;
        return (
            <pre className="contentSubPageP">
                {subPageP}
            </pre>
        );
    }
});
// 内容分段图表
var ContentSubPageChart = React.createClass({
    render: function() {
        return (
            <div className="contentSubPageChart">
            </div>
        )
    }
});


// 内容
var ReportContent = React.createClass({
    render: function() {
        return (
            <div className="reportCard reportContent">
                <ReportCardHeader title={this.props.initData.content} />
                <div className="reportCardContentBody">
                    <ContentPageHeader id="menu_0" menuItem={initDataLoaded?this.props.initData.menu_list[0]:""} score={dataLoaded?this.props.data.menu_1.score:""} />
                    <ContentPageHeaderEm emItem={dataLoaded?this.props.data.menu_1.em:""} />
                    <ContentSubPageHeader subMenuItem={dataLoaded?this.props.initData.menu_1.subMenu[0].title:""} subMenuItemAnnotation={dataLoaded?this.props.data.menu_1.subMenu[0].title_annotation:""}/>
                    <ContentSubPageP subPageP={dataLoaded?this.props.initData.menu_1.subMenu[0].p1:""} />
                    <ContentSubPageChart />
                    <ContentSubPageP subPageP={dataLoaded?this.props.initData.menu_1.subMenu[0].p2:""} />
                    <ContentSubPageChart />
                    <ContentSubPageP subPageP={dataLoaded?this.props.data.menu_1.subMenu[0].summary:""} />

                    <ContentPageHeader id="menu_1" menuItem={initDataLoaded?this.props.initData.menu_list[1]:""} score={dataLoaded?this.props.data.menu_2.score:""} />
                    <ContentPageHeaderEm emItem={dataLoaded?this.props.data.menu_2.em:""} />
                    <ContentSubPageHeader subMenuItem={dataLoaded?this.props.initData.menu_2.subMenu[0].title:""} subMenuItemAnnotation={dataLoaded?this.props.data.menu_2.subMenu[0].title_annotation:""}/>
                    <ContentSubPageChart />
                    <ContentSubPageP subPageP={dataLoaded?this.props.data.menu_2.subMenu[0].summary:""} />
                    <ContentSubPageHeader subMenuItem={dataLoaded?this.props.initData.menu_2.subMenu[1].title:""} subMenuItemAnnotation={dataLoaded?this.props.data.menu_2.subMenu[1].title_annotation:""}/>
                    <ContentSubPageChart />
                    <ContentSubPageP subPageP={dataLoaded?this.props.data.menu_2.subMenu[1].summary:""} />
                    <ContentSubPageHeader subMenuItem={dataLoaded?this.props.initData.menu_2.subMenu[2].title:""} subMenuItemAnnotation={dataLoaded?this.props.data.menu_2.subMenu[2].title_annotation:""}/>
                    <ContentSubPageChart />
                    <ContentSubPageP subPageP={dataLoaded?this.props.data.menu_2.subMenu[2].summary:""} />
                    <ContentSubPageHeader subMenuItem={dataLoaded?this.props.initData.menu_2.subMenu[3].title:""} subMenuItemAnnotation={dataLoaded?this.props.data.menu_2.subMenu[3].title_annotation:""}/>
                    <ContentSubPageChart />
                    <ContentSubPageP subPageP={dataLoaded?this.props.data.menu_2.subMenu[3].summary:""} />
                    <ContentSubPageHeader subMenuItem={dataLoaded?this.props.initData.menu_2.subMenu[4].title:""} subMenuItemAnnotation={dataLoaded?this.props.data.menu_2.subMenu[4].title_annotation:""}/>
                    <ContentSubPageChart />
                    <ContentSubPageP subPageP={dataLoaded?this.props.data.menu_2.subMenu[4].summary:""} />


                    <ContentPageHeader id="menu_2" menuItem={initDataLoaded?this.props.initData.menu_list[2]:""} score={dataLoaded?this.props.data.menu_3.score:""} />
                    <ContentPageHeader id="menu_3" menuItem={initDataLoaded?this.props.initData.menu_list[3]:""} score={dataLoaded?this.props.data.menu_4.score:""} />

                </div>
            </div>
        )
    }
});





React.render(
    <ReportBody initUrl={initUrl} dataUrl={dataUrl} />,
    $("body")[0]
);