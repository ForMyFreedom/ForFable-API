import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm"
import { DateTime } from "luxon"

export default class Constant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  strengthOfPositiveOpinion: number // For every positive reaction, it will gain this in the User Score
  @column()
  negativeOpinionStrength: number   // For each complaint, it will lose this in the User Score
  @column()
  deleteStrength: number            // For every automatically deleted comment, it will lose that in the User Score [Probably remove]
  @column()
  completionPercentage: number      // When multiplied with the popularity of the story, if a proposal has more conclusive reactions than that, the story ends with it
  @column()
  exclusionPercentage:number        // When multiplied with the popularity of the story, if a comment/proposal has more complaints than that, the comment/proposal will be deleted [What about the prompt case, is genre popularity used]
  @column()
  banLimit: number                  // When a User Score reaches this negative value, the User will be automatically excluded from the system

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
