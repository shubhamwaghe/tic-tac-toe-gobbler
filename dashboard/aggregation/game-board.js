[
  {
    "$match": {
      "winnerPlayer": {
        "$nin": [
          null,
          ""
        ]
      },
      "myColor": {
        "$nin": [
          null,
          ""
        ]
      }
    }
  },
  {
    "$group": {
      "_id": {
        "__alias_0": "$playerNames.B",
        "__alias_1": "$playerNames.R",
        "__alias_2": "$winnerPlayerName"
      },
      "__alias_3": {
        "$sum": {
          "$cond": [
            {
              "$ne": [
                {
                  "$type": "$winnerPlayerName"
                },
                "missing"
              ]
            },
            1,
            0
          ]
        }
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      "__alias_0": "$_id.__alias_0",
      "__alias_1": "$_id.__alias_1",
      "__alias_2": "$_id.__alias_2",
      "__alias_3": 1
    }
  },
  {
    "$project": {
      "group": "$__alias_0",
      "group_series_0": "$__alias_1",
      "value": "$__alias_3",
      "group_series_1": "$__alias_2",
      "_id": 0
    }
  },
  {
    "$sort": {
      "value": 1
    }
  },
  {
    "$limit": 50000
  }
]
