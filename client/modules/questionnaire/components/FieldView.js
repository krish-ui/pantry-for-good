import React from 'react'
import {connect} from 'react-redux'
import {capitalize} from 'lodash'
import {compose} from 'recompose'
import {DragSource, DropTarget} from 'react-dnd'
import {ListGroupItem} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {moveField} from '../reducers/editor/index'

const mapStateToProps = state => ({
  sectionId: selectors.qEditor.getSelectedSection(state)
})

const mapDispatchToProps = dispatch => ({
  moveField: (fieldId, sectionId, idx) => dispatch(moveField(fieldId, sectionId, idx))
})

const fieldSource = {
  beginDrag(props) {
    return {
      id: props.field._id,
      idx: props.idx
    }
  }
}

const fieldTarget = {
  hover(props, monitor) {
    const {id, idx} = monitor.getItem()
    const dropIndex = props.idx

    if (idx === dropIndex) return

    props.moveField(id, props.sectionId, dropIndex)

    monitor.getItem().idx = dropIndex
  }
}

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

const FieldView = ({
  connectDragSource,
  connectDropTarget,
  isDragging,
  isOver,
  idx,
  field,
  onSelect
}) => connectDragSource(
  connectDropTarget(
    <div>
      <ListGroupItem
        header={field.label}
        onClick={onSelect}
        style={{
          border: 'none',
          opacity: isDragging || isOver ? '0.5' : 1
        }}
      >
        {mapTypeToDescription(field.type)}
      </ListGroupItem>
    </div>
  )
)

function mapTypeToDescription(type) {
  switch (type) {
    case 'textarea': return 'Long Text'
    case 'radio': return 'Radio Buttons'
    case 'checkbox': return 'Checkboxes'
    case 'foodPreferences': return 'Food Preferences'
    default: return capitalize(type)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  DragSource('field', fieldSource, collectSource),
  DropTarget('field', fieldTarget, collectTarget)
)(FieldView)
