import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Grid extends Component {
  clicker = (a) => {
    const {click, row, col, next, judge} = this.props
    click(row, col)
    const position = `${row.toString()},${col.toString()}`
    judge(position, next)
  }
  render() {
    const {row, col, whiteList, blackList} = this.props
    let rowS = row.toString()
    let colS = col.toString()
    let digit = `${rowS},${colS}`
    let tag = ''
    if (whiteList.includes(digit)){
      tag = `${rowS},${colS} row_${rowS} col_${colS} grid white`
    } else if (blackList.includes(digit)){
      tag = `${rowS},${colS} row_${rowS} col_${colS} grid black`
    } else {
      tag = `${rowS},${colS} row_${rowS} col_${colS} grid`
    }
    return(
    <div className={tag} onClick={this.clicker}></div>
    )
  }
}
class Row extends Component {
  judgedeliver = (a,b) => {
    const {judge} = this.props
    judge(a, b)
  }
  render() {
    const {rowNum, click, black, white} = this.props
    const rowEmpty = Array.from(Array(19).keys())
    const rowList = rowEmpty.map(item => {
      return(<Grid col={item} row={rowNum} key={rowNum*19+item} click={click}
                    blackList={black} whiteList={white} judge={this.judgedeliver} next={this.props.next}/>)
    })
    return(
    <div className='row'>{rowList}</div>
    )
  }
}
class Winner extends Component {
  render(){
    const {winner,next} = this.props;
    if (winner !== 'none'){
      return(
      <div className='result state'>Winner：{winner}</div>
      )
    } else {
      let classes = `stage state ${next ? 'black' : 'white'}`;
      return(<div className={classes}>Stage : {next ? 'Black' : 'White'}</div>);
    }
  }
}
class Board extends Component {
  constructor(){
    super()
    this.state = {
      white:[],
      black:[],
      winner:'none',
      next:true
    }
  }
  click = (a,b) => {
    const position = a.toString() + ',' + b.toString()
    let {white, black, next} = this.state
    if (this.state.next) {
      black.push(position)
    } else {
      white.push(position)
    }
    this.setState ({
      black:black,
      white:white,
      winner:'none',
      next:!next
    })
  }

  judge = (a,b) => {
    const site = a.split(',')
    let row = parseInt(site[0])
    let col = parseInt(site[1])
    let distribution = []
    if (b) {
      distribution = this.state.black
    } else {
      distribution = this.state.white
    }
    function judgement (c, d) {
      let line = 1
      for (let i = 1; i < 6; i += 1) {        
        let neighbor = `${row + i * c},${col + i * d}`
        if (!distribution.includes(neighbor)) break;
        line += 1
      }
      for (let i = 1; i < 6; i += 1) {
        let neighbor = `${row - i * c},${col - i * d}`
        if (!distribution.includes(neighbor)) break;
        line += 1
      }
      if (line >= 5){
        let win = b ? 'Black' : 'White'
        return win;
      }
    }
    let judgelist = []
    let analysis = [[0,1], [1,0], [1,1], [1,-1]]
    for (let k = 0; k < 4; k += 1) {
      judgelist[k] = judgement(analysis[k][0],analysis[k][1])
      if (judgelist[k]) {
        this.setState(state => ({
          white:state.white,
          black:state.black,
          next:state.next,
          winner:judgelist[k]
        }))
      }
    }
  }
  render() {
    const boardEmpty=Array.from(Array(19).keys())
    const {black, white} = this.state
    const total = boardEmpty.map(item => {
      return(<Row rowNum={item} click={this.click} key={'row'+item.toString()} 
                  black={black} white={white} judge={this.judge} next={this.state.next}/>)
    })
    return(
    <div className='container'>
      <div>{total}</div>
      <Winner winner={this.state.winner} next={this.state.next}/>
    </div>
    )
  }
}
ReactDOM.render(<Board/>,document.querySelector('main'))