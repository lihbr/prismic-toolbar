import './DevModeCollapsible.css';
import { Component } from 'preact';
import Collapsible from 'react-collapsible';
import React, { Fragment } from 'react';
import { collapsibleArrow } from '.';
import { copyText } from 'common';
import { JsonView } from '..';

/* ----- BEGINNING OF CLASS ----- */
export class DevModeCollapsible extends Component{
  constructor (props) {
    super(props);
    this.state = { docData : props.docData }
  }


  /* ----- TRIGGER(HEADER) FOR THE COLLAPSIBLE  ----- */
  Trigger = ({ title, nbLinkedDoc, isOpen }) => (
      <div className='wrapper-trigger'>
        <h2 className='trigger-title'> {title} </h2>
        <h3 className='trigger-subtitle'>{nbLinkedDoc} linked documents</h3>
        <img className={isOpen ? 'trigger-triangle active' : 'trigger-triangle'} src={collapsibleArrow} />
      </div>
  )


  /* ----- RETURN TRIGGER INFOS ----- */
  getTriggerInfo = docData => {
    if(!docData){ return }

    // reducer to count the custom types queried
    const triggerInfoReducer = (acc, val) => {
      if(acc[val.type]) {
        acc[val.type] += 1;
      } else {
        acc[val.type] = 1;
      }
      return acc;
    }

    /*
      expected format of triggerInfo
      {
        type1 : ...,
        type2 : ...,
        ...
      }
    */
    const triggerInfo = docData.map(doc => {
        const type = doc.type;
        return {type: type}
        }).reduce(
          triggerInfoReducer,
          {}
        )
    const title = this.constructTitle(triggerInfo);

    // expected format of title : (X) type 1 & (Y) type 2 ...
    const nbLinkedDoc = docData.map( doc => this.countLinkedDocInObject(doc.data) ).reduce( (acc, val) => acc + val );

    // expected to return title and number of linked docs
    return { title: title, nbLinkedDoc: nbLinkedDoc };
  }


  /* ----- CONSTRUCT TITLE BASED ON TYPES AND OCCURRENCES -----*/
  constructTitle = triggerInfo => {
    if(!triggerInfo){return ''}

    let title = '';
    const copyInfo = JSON.parse( JSON.stringify(triggerInfo) );

    const keys = Object.keys(copyInfo);
    const length = keys.length;
    keys.map( (key, index) => {
      title += key + ' (' + copyInfo[key] + ')';
      index != length - 1 ? title += ' & ' : '';
    });

    return title;
  }


  /* ----- RETURN NUMBER OF LINKED DOCUMENT FOR A QUERY ----- */
  countLinkedDocInObject = data => {
    if(!data){return 0} // First case data is empty or null
    if(data['link_type'] === 'Document' && data['id']){return 1} // Second case there is a document, return 1 to increment the count

    // Last case it is an object but not a document, so we check every object inside.
    var count = 0;
    var types = {};
    const keys = Object.keys(data);

    keys.forEach(key => {
      if(typeof data[key] === 'object') {
        const newCount = this.countLinkedDocInObject( data[key] );
        count += newCount;
      }
    })
    return count;
  }


  /* ----- RENDER FUNCTION ----- */
  render() {
    const { docData } = this.state;

    return (
      <div>
      {
        docData.map( (query, index) => {
          const triggerInfo = this.getTriggerInfo(query);

          return (
            <Collapsible
              trigger={<this.Trigger title={triggerInfo.title} nbLinkedDoc={triggerInfo.nbLinkedDoc} />}
              triggerWhenOpen={<this.Trigger title={triggerInfo.title} nbLinkedDoc={triggerInfo.nbLinkedDoc} isOpen />}
              transitionTime={100}>
              {query.map( (doc, index) => (
                  <JsonView
                    json={doc}
                    maxStringSize={25}
                  />
               )
              )}
            </Collapsible>
          )
        })
      }
      </div>
    )
  }
}
