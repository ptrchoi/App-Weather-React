// LIBRARIES
import React from 'react';
import Autosuggest from 'react-autosuggest';

// UTILITY FUNCTIONS
import { getGoogleCityAutofill } from './../Utils';

// LOCAL FUNCTIONS
/* getSuggestionValue() automatically called by Autosuggest: this req'd function teaches Autosuggest what the input value should be when a suggestion value is highlighted. Here, we're simply passing the suggestion string back as the input value. */
const handleSuggestion = (suggestion) => {
  return suggestion;
};

// Automatically called by Autosuggest: Tells Autosuggest how to render suggestions
const renderSuggestion = (suggestion) => {
  return <div className="renderSuggestionDiv">{suggestion}</div>;
};

// Headline  COMPONENT CLASS
class Headline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      stateName: '',
      country: '',
      search: {
        value: '',
        citySuggestions: [],
      },
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(
      this
    );
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.handleTargetLocation = this.handleTargetLocation.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props.location != prevProps.location) {
      this.setState({
        city: this.props.location.city,
        stateName: this.props.location.stateName,
        country: this.props.location.country,
      });
    }
  }
  // Automatically called by Autosuggest's onChange event
  onChange = (event, { newValue }) => {
    this.setState({
      search: {
        value: newValue,
        citySuggestions: [],
      },
    });
  };
  // Automatically called by Autosuggest's input event;
  // Async call to Google API to get suggestions for dropdown list
  onSuggestionsFetchRequested = async ({ value }) => {
    const autofillData = await getGoogleCityAutofill(value);

    let citySuggestions = autofillData.predictions.map((el) => {
      return el.description;
    });

    this.setState({
      search: {
        value: value,
        citySuggestions: citySuggestions,
      },
    });
  };
  // Automatically called by Autosuggest's input clear event
  onSuggestionsClearRequested = () => {
    this.setState({
      search: {
        value: '',
        citySuggestions: [],
      },
    });
  };
  // Optional Autosuggest function: called on selection event (mouse/keyboard/touch) from list; suggestion obj comes from Autosuggest's req'd `handleSuggestion()` method.
  onSuggestionSelected = (e, suggestion) => {
    this.props.onNewCity(suggestion.suggestion); //Pass in only the suggestion obj's suggestion string
  };
  getDate() {
    return new Date().toDateString();
  }
  handleTargetLocation(e) {
    e.preventDefault();

    this.props.onFindLoc();
  }
  render(props) {
    const { city, search } = this.state;
    const { value, citySuggestions } = search;

    // Required by Autosuggest
    // type=search is optional, defaults to type=text
    const inputProps = {
      placeholder: 'Enter City or ZIP code',
      value,
      onChange: this.onChange,
      type: 'search',
    };

    return (
      <div className="headline-container">
        <div>
          <p>
            <span>{this.getDate()}</span>
            {'   '}
            <span>{this.props.time}</span>
          </p>
          <p>{city}</p>
        </div>
        <div>
          <button onClick={this.handleTargetLocation}>
            <i className="fas fa-crosshairs"></i>
          </button>
          <Autosuggest
            suggestions={citySuggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={handleSuggestion}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        </div>
      </div>
    );
  }
}
export default Headline;
