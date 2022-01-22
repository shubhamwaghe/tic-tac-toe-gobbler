[
  {
    "$match": {
      "playerNames.R": {
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
        "__alias_0": "$playerNames.R"
      },
      "__alias_1": {
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
      "__alias_1": 1
    }
  },
  {
    "$project": {
      "value": "$__alias_1",
      "label": "$__alias_0",
      "_id": 0
    }
  },
  {
    "$addFields": {
      "__agg_sum": {
        "$sum": [
          "$value"
        ]
      }
    }
  },
  {
    "$sort": {
      "__agg_sum": -1
    }
  },
  {
    "$project": {
      "__agg_sum": 0
    }
  },
  {
    "$limit": 5000
  }
]
