// Write your code here
import {Component} from 'react'

import Loader from 'react-loader-spinner'

import LatestMatch from '../LatestMatch'

import MatchCard from '../MatchCard'

import PieChart from '../PieChart'

import './index.css'

class TeamMatches extends Component {
  state = {
    matchDetails: {},
    isTrue: true,
  }

  componentDidMount() {
    this.getResponse()
  }

  getResponse = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const response = await fetch(`https://apis.ccbp.in/ipl/${id}`)
    const data = await response.json()
    const newData = {
      teamBannerUrl: data.team_banner_url,
      latestMatchDetails: data.latest_match_details,
      recentMatches: data.recent_matches,
    }
    const {latestMatchDetails} = newData
    const newLatestDetails = {
      date: latestMatchDetails.date,
      venue: latestMatchDetails.venue,
      result: latestMatchDetails.result,
      umpires: latestMatchDetails.umpires,
      competingTeam: latestMatchDetails.competing_team,
      competingTeamLogo: latestMatchDetails.competing_team_logo,
      firstInnings: latestMatchDetails.first_innings,
      secondInnings: latestMatchDetails.second_innings,
      manOfTheMatch: latestMatchDetails.man_of_the_match,
      matchStatus: latestMatchDetails.match_status,
    }
    const {recentMatches} = newData
    const newRecentMatches = recentMatches.map(eachValue => ({
      id: eachValue.id,
      competingTeam: eachValue.competing_team,
      competingTeamLogo: eachValue.competing_team_logo,
      result: eachValue.result,
      matchStatus: eachValue.match_status,
    }))
    newData.recentMatches = newRecentMatches
    newData.latestMatchDetails = newLatestDetails
    this.setState({matchDetails: newData, isTrue: false})
  }

  navigateToHome = () => {
    const {history} = this.props
    history.replace('/')
  }

  getNoMatchDetails = value => {
    const {matchDetails} = this.state

    if (!matchDetails) {
      return 0
    }

    const {latestMatchDetails, recentMatches} = matchDetails

    if (!latestMatchDetails || !recentMatches) {
      return 0
    }

    const currentMatch = value === latestMatchDetails.matchStatus ? 1 : 0
    const result =
      recentMatches.filter(match => match.matchStatus === value).length +
      currentMatch

    return result
  }

  getPieChartDetails = () => [
    {name: 'Won', value: this.getNoMatchDetails('Won')},
    {name: 'Lost', value: this.getNoMatchDetails('Lost')},
    {name: 'Drawn', value: this.getNoMatchDetails('Drawn')},
  ]

  render() {
    const {matchDetails, isTrue} = this.state
    const {match} = this.props
    const {params} = match
    const {id} = params
    const {teamBannerUrl, latestMatchDetails, recentMatches} = matchDetails

    return (
      <>
        <div className={`bg-container ${id}`}>
          {isTrue && (
            <div data-testid="loader">
              <Loader type="Oval" color="#ffffff" height={50} width={50} />
            </div>
          )}

          {!isTrue && (
            <>
              <img
                src={teamBannerUrl}
                className="banner-img"
                alt="team banner"
              />

              <PieChart data={this.getPieChartDetails()} />

              <h1 className="latest-name">Latest Matches</h1>
              <LatestMatch
                key={latestMatchDetails.id}
                latestDetails={latestMatchDetails}
              />
              <ul className="recent-list">
                {recentMatches.map(eachValue => (
                  <MatchCard key={eachValue.id} matchDetails={eachValue} />
                ))}
              </ul>
            </>
          )}
          {!isTrue && (
            <button
              type="button"
              className="back-button"
              onClick={this.navigateToHome}
            >
              Back
            </button>
          )}
        </div>
      </>
    )
  }
}
export default TeamMatches
