import React from 'react';
import classNames from 'classnames';
import PureRenderMixin from './PureRenderMixin';
import assign from 'object-assign';
import Lazyload from 'react-lazy-load';
import Checkbox from 'bee-checkbox';

function isRenderResultPlainObject(result) {
  return result && !React.isValidElement(result) &&
    Object.prototype.toString.call(result) === '[object Object]';
}

class Item extends React.Component{
  shouldComponentUpdate(...args) {
    return PureRenderMixin.shouldComponentUpdate.apply(this, args);
  }
  matchFilter = (text) => {
    const { filter, filterOption, item } = this.props;
    if (filterOption) {
      return filterOption(filter, item);
    }
    return text.indexOf(filter) >= 0;
  }
  render() {
    const { render, filter, item, lazy, checked, prefixCls, onClick } = this.props;

    const renderResult = render(item);
    let renderedText;
    let renderedEl;
    if (isRenderResultPlainObject(renderResult)) {
      renderedText = renderResult.value;
      renderedEl = renderResult.label;
    } else {
      renderedText = renderResult;
      renderedEl = renderResult;
    }

    if (filter && filter.trim() && !this.matchFilter(renderedText)) {
      return null;
    }

    const className = classNames({
      [`${prefixCls}-content-item`]: true,
      [`${prefixCls}-content-item-disabled`]: item.disabled,
    });

    const lazyProps = assign({
      height: 32,
      offset: 500,
      throttle: 0,
      debounce: false,
    }, lazy);

    let lazyFlag = true;
    if(lazy && lazy.container == "modal")
    {
      lazyFlag = false
    }

    if(!lazyFlag) {
      return (
        <li
          className={className}
          title={renderedText}
          onClick={item.disabled ? undefined : () => onClick(item)}
        >
          <Checkbox checked={checked} disabled={item.disabled} />
          <span>{renderedEl}</span>
        </li>
      )
    }else {
        return (
          <Lazyload {...lazyProps}>
            <li
              className={className}
              title={renderedText}
              onClick={item.disabled ? undefined : () => onClick(item)}
            >
              <Checkbox checked={checked} disabled={item.disabled} />
              <span>{renderedEl}</span>
            </li>
          </Lazyload>
        );
    }
    
  }
}

export default Item;
