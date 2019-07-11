import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Input, Radio, List, Typography } from "antd";
import tool from "./common/tool";
import "./common/tool.css";
import "./index.css";

class APP extends Component {
  constructor() {
    super();
    const todoList = JSON.parse(localStorage.getItem("todoList")) || [];
    const completeList = JSON.parse(localStorage.getItem("completeList")) || [];
    this.state = {
      todoList: todoList, //待办列表
      completeList: completeList, //已完成列表
      todo: {
        //当前新加待办
        todoVal: "",
        addDate: "",
        upDate: "",
        isEdit: false
      },
      curShow: 1 //true显示待办列表，false显示完成列表
    };
    this.todoHanler = this.todoHanler.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.editComplete = this.editComplete.bind(this);
  }
  // todo 输入框的值得绑定
  todoHanler(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    this.setState({
      todo: {
        ...this.state.todo,
        todoVal: value
      }
    });
  }
  // 添加todo
  addTodo() {
    if (tool.isEmpty(this.state.todo.todoVal)) {
      return;
    }
    this.setState(state => {
      let todo = { ...state.todo };
      todo.addDate = new Date().toLocaleString();
      return {
        todoList: [...state.todoList, todo],
        todo: {
          todoVal: "",
          addDate: "",
          upDate: "",
          isEdit: false
        },
        curShow:1
      };
    });
  }
  // 编辑todo完成
  editComplete(index, e) {
    const value = e.target.value;
    let data = this.state.todoList.slice();
    data[index].todoVal = value;
    data[index].isEdit = false;
    this.setState({
      todoList: data
    });
  }
  // todo列表的操作按钮回调函数
  todoOperation(type, i, type2) {
    let todoList = this.state.todoList.slice();
    if (type === "edit") {
      todoList[i].isEdit = true;
    } else if (type === "delete") {
      if (type2 === "completeList") {
        let  completeList = this.state.completeList.slice()
        completeList.splice(i, 1)
        this.setState({
          completeList:  completeList
        });
      } else {
        todoList.splice(i, 1);
      }
    } else if (type === "complete") {
      let item = todoList.splice(i, 1);
      this.setState({
        completeList: [...this.state.completeList, ...item]
      });
    }
    this.setState({
      todoList: todoList
    });
  }
  render() {
    const state = tool.clone(this.state);
    localStorage.setItem("todoList", JSON.stringify(state.todoList));
    localStorage.setItem("completeList", JSON.stringify(state.completeList));

    let evenList;
    if (this.state.curShow) {
      evenList = (
        <List
          bordered
          dataSource={this.state.todoList}
          itemLayout="vertical"
          renderItem={(item, i) => (
            <List.Item
            extra={item.addDate}
              actions={[
                <span
                  onClick={() => this.todoOperation("edit", i)}
                  style={{ color: "#1890ff" }}
                >
                  编辑
                </span>,
                <span
                  onClick={() => this.todoOperation("delete", i)}
                  style={{ color: "#1890ff" }}
                >
                  删除
                </span>,
                <span
                  onClick={() => this.todoOperation("complete", i)}
                  style={{ color: "#1890ff" }}
                >
                  完成
                </span>
              ]}
              
            >
              <div className="list-item-wrapper">
                <EditText
                  index={i}
                  value={item.todoVal}
                  inShowInput={item.isEdit}
                  editComplete={this.editComplete}
                />
              </div>
              {/* <div className="m-l-5">{item.addDate}</div>            */}
            </List.Item>
          )}
        />
      );
    } else {
      evenList = (
        <List
          bordered
          dataSource={this.state.completeList}
          itemLayout="horizontal"
          renderItem={(item, i) => (
            <List.Item
              actions={[
                <span
                  onClick={() =>
                    this.todoOperation("delete", i, "completeList")
                  }
                  style={{ color: "#1890ff" }}
                >
                  删除
                </span>
              ]}
            >
              <div className="list-item-wrapper">
                <Typography.Text disabled>{item.todoVal}</Typography.Text>
              </div>
              <div className="m-l-5">{item.addDate}</div>
            </List.Item>
          )}
        />
      );
    }
    return (
      <div className="todo-wrapper">
        <Input.Search
          size="large"
          name="todo.todoVal"
          placeholder="请输入待办事项"
          value={this.state.todo.todoVal}
          onChange={this.todoHanler}
          onSearch={this.addTodo}
          enterButton="Enter"
        />
        <div className="event-list m-t-15">
          <Radio.Group
            value={this.state.curShow}
            onChange={e => this.setState({ curShow: e.target.value })}
            buttonStyle="solid"
            defaultValue="todoList"
          >
            <Radio.Button value={1}>待办列表</Radio.Button>
            <Radio.Button value={0}>已完成列表</Radio.Button>
          </Radio.Group>
          <div className="todo-list-wrapper m-t-15">{evenList}</div>
        </div>
      </div>
    );
  }
}
// 可以切换查看和编辑text的组件
class EditText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoVal: null
    };
  }
  componentDidMount() {
    this.setState({
      todoVal: this.props.value
    });
  }
  inputHandler(e) {
    this.setState({
      todoVal: e.target.value
    });
  }
  render() {
    let edit;
    if (!this.props.inShowInput) {
      edit = <span style={{ wordBreak: "break-all" }}>{this.props.value}</span>;
    } else {
      edit = (
        <Input.TextArea
          onPressEnter={e => this.props.editComplete(this.props.index, e)}
          onChange={e => this.inputHandler(e)}
          onBlur={e => this.props.editComplete(this.props.index, e)}
          value={this.state.todoVal}
          size="small"
          autosize
        />
      );
    }
    return <>{edit}</>;
  }
}

ReactDOM.render(<APP />, document.getElementById("root"));
