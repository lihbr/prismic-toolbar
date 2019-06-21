import { Panel, Menu, PreviewMenu, views } from '..';
import { Component } from 'preact';

const { NONE } = views;

export class Toolbar extends Component {
  constructor({ prediction }) {
    super(...arguments);
    this.closePreview = this.closePreview.bind(this);

    console.log('documents', prediction.documents);

    this.state = {
      page: NONE,
      documents: prediction ? prediction.documents : [],
      queries: [],
      renderedPreview: this.props.preview.active,
      documentsLoading: false
    };
    if (prediction) {
      prediction.onDocuments((documents, queries) => {
        console.log('prediction.ondocuments');
        this.setState({ documents, queries, documentsLoading: false });
      });

      prediction.onDocumentsLoading(() => {
        this.setState({ documentsLoading: true });
      });
    }
  }

  setPage = page => this.setState({ page });

  closePreview() {
    this.setState({ renderedPreview: false });
  }

  render() {
    const { preview, analytics, auth } = this.props;
    const { page, documents, queries } = this.state;
    const hasDocs = Boolean(documents.length);

    console.log(documents.length, '<-- docs len')
    return (
      <div className="Toolbar">
        <Panel
          onDocumentClick={analytics && analytics.trackDocumentClick}
          closePanel={() => this.setPage(NONE)}
          documentsLoading={this.state.documentsLoading}
          documents={documents}
          queries={queries}
          preview={preview}
          page={page}
        />
        <Menu setPage={this.setPage} page={page} in={hasDocs} />
        { this.props.displayPreview && this.state.renderedPreview
          ? <PreviewMenu
            auth={auth}
            closePreview={this.closePreview}
            setPage={this.setPage}
            preview={preview}
            in={preview.active} />
          : null
        }
      </div>
    );
  }
}