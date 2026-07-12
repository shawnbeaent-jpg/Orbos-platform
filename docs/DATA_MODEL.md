# Data Model Notes

Source of truth: `prisma/schema.prisma`. This doc is a plain-language map for non-engineers reading the schema.

| Table              | Maps to CRM tracker tab           | Notes                                                                                                                                                            |
| ------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Company`           | Companies                          | `priority` is A/B/C, `status` is the 7-stage funnel from New Lead to Closed Lost                                                                                 |
| `Contact`           | Contacts                           | Belongs to one Company                                                                                                                                            |
| `PipelineEntry`     | Sales Pipeline                     | Belongs to one Company; `probability` is a fraction (0.5 = 50%), `estimatedValueCents * probability` = weighted value                                            |
| `MarketingAsset`    | Marketing Assets                   | Standalone, not linked to a company                                                                                                                               |
| `Route` / `RouteStop` | Routes                           | A Route has many ordered RouteStops, each pointing to a Company                                                                                                   |
| `AgentSuggestion`   | (new — no CRM tracker equivalent)  | Every AI agent call is logged here. `accepted` stays false until a human confirms it should apply to real data. This is the enforcement mechanism for the "no auto-changes" rule in CLAUDE.md. |

Money: always stored as integer cents (`estDealValueCents`), never floats. Format as dollars only when displaying.

Dates: Postgres `timestamp` via Prisma `DateTime`. Never store dates as free text.

Why enums for Priority/Status/PipelineStage: these values are used throughout the CRM tracker's dropdowns and conditional formatting. Keeping them as enums (not free-text strings) means a typo can't silently create a fourth "status" that breaks the dashboard's aggregation queries.
