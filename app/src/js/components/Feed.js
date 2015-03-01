var React = require('react');
var ShowAddButton = require('./ShowAddButton');
var FeedForm = require('./FeedForm');
var FeedList = require('./FeedList');
var _ = require('lodash');
var Firebase = require('firebase');

var Feed = React.createClass({

	loadData: function() {
		var ref = new Firebase('https://popping-fire-7171.firebaseio.com/feed');
		ref.on('value', function(snap) {
			var items = [];
			var sorted = [];

			snap.forEach(function(itemSnap) {
				var item = itemSnap.val();
				item.key = itemSnap.key();
				item.feedItemKey = itemSnap.key();
				items.push(item);
			});

			sorted = _.sortBy(items, function(item) {
				return -item.voteCount;
			})

			this.setState({
				items: sorted
			});
			
		}.bind(this));
	},

	componentDidMount: function() {
		this.loadData();
	},

	getInitialState: function() {
		return {
			items: [],
			formDisplayed: false
		};
	},

	onToggleForm: function() {
		this.setState({
			formDisplayed: !this.state.formDisplayed
		});
	},

	onNewItem: function(newItem) {
		var ref = new Firebase('https://popping-fire-7171.firebaseio.com/feed');
		var newItemRef = ref.push(newItem);

		// I'm not sure why this is neccessary...wasn't done in tutorial!
		newItemRef.update({feedItemKey: newItemRef.key()});
	},

	onVote: function(item) {
		var ref = new Firebase('https://popping-fire-7171.firebaseio.com/feed').child(item.feedItemKey);
		ref.update(item);
	},

	render: function() {
		return (
			<div>
				<div className="container">
					<ShowAddButton displayed={this.state.formDisplayed} onToggleForm={this.onToggleForm} />
				</div>

				<FeedForm displayed={this.state.formDisplayed} onNewItem={this.onNewItem} />

				<br />
				<br />

				<FeedList items={this.state.items} onVote={this.onVote} />
			</div>
		);
	}

});

module.exports = Feed;