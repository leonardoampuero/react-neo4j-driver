import React from 'react';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      messageFrom: [],
      messageTo: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.driver = neo4j.v1.driver("bolt://130.211.129.44:7687",
      neo4j.v1.auth.basic('neo4j', 'neo4j'));
  }

  fetchMessages() {
    const session = this.driver.session();

    session.run(`
      MATCH (us1:User)-[r:SENT]->(msg:Message)-[t:TO]->(usrTo:User)
      WHERE usrTo.name="Wolverine"
      RETURN msg as name`
    ).then(result => {
      let msgs = [];
      result.records.forEach(function (record) {
        msgs.push(record.get('name').properties);
      });
      this.setState({messageFrom: msgs.slice()});
      session.close();
    }).catch(e => {
      console.log(e);
      session.close();
    });
  };

  componentDidMount() {
    this.fetchMessages();
  }

  componentWillUnmount() {
  }

  handleSubmit(event) {
    event.preventDefault();
    const session = this.driver.session();

    session.run(`
      MATCH (a:User),(b:User)
      WHERE a.name = 'Leo' AND b.name = 'Wolverine'
      CREATE (a)-[:SENT]->(msg1:Message {contents:'`+ this.state.value +`'})-[:TO]->(b)`
    ).then(result => {
      console.log(result);
      session.close();
    }).then (() => {
      this.fetchMessages();
    }).catch(e => {
      console.log(e);
      session.close();
    });
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div>
        <div>
          {
            (this.state.messageFrom.map((item, i) => <li key={i}>{item.contents}</li>))
          }
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Message:
              <input type="text" value={this.state.value} onChange={this.handleChange}/>
            </label>
            <input type="submit" value="Submit"/>
          </form>
        </div>
      </div>
    );
  }
}

export default App;

