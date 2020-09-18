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
  return <div>{suggestion}</div>;
};

// Headline  COMPONENT CLASS
class Headline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      stateName: '',
      country: '',
      value: '',
      suggestions: [],
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(
      this
    );
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.handleTargetLocation = this.handleTargetLocation.bind(this);
  }
  componentDidMount() {
    // Initiate the Google Autocomplete API call - this is needed to avoid a delay in the first user input on search!
    this.onSuggestionsFetchRequested('');
  }
  componentDidUpdate(prevProps) {
    if (this.props != prevProps) {
      this.setState({
        city: this.props.location.city,
        stateName: this.props.location.stateName,
        country: this.props.location.country,
      });
    }
  }
  // Automatically called by Autosuggest's onChange event
  onChange = (event, { newValue }) => {
    // event.preventDefault();

    this.setState({
      value: newValue,
    });
  };
  // Automatically called by Autosuggest's input event;
  // Async call to Google API to get suggestions for dropdown list
  onSuggestionsFetchRequested = async ({ value }) => {
    const autofillData = await getGoogleCityAutofill(value);

    let suggestions = autofillData.predictions.map((el) => {
      return el.description;
    });

    this.setState({
      suggestions: suggestions,
    });
  };
  // Automatically called by Autosuggest's input clear event
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };
  // Optional Autosuggest function: called on selection event (mouse/keyboard/touch) from list; suggestion obj comes from Autosuggest's req'd `handleSuggestion()` method.
  onSuggestionSelected = (e, suggestion) => {
    // e.preventDefault();

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
    let { city, value, suggestions } = this.state;

    if (city === '') city = 'Temp City Name';

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
        <div className="headline-box time-date-box">
          <span className="time">{this.props.time}</span>
          <span className="date">{this.getDate()}</span>
        </div>
        <div className="headline-box city">{city}</div>
        <div className="headline-box search">
          <button className="loc-btn" onClick={this.handleTargetLocation}>
            {/* <i className="fas fa-crosshairs"></i> */}
            <i className="fas fa-map-marker-alt"></i>{' '}
          </button>
          <Autosuggest
            suggestions={suggestions}
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
