/* Billy Labs published progression collections — schema foundation v1.8.0
   Public data only. Private curator notes must never be placed in this file. */
window.BILLY_COLLECTIONS = {
  schemaVersion: 1,
  rarityRules: {
    public:    { reveal: { type: "immediate" },         pointsPerMashup: 1,  completionMultiplier: 1 },
    common:    { reveal: { type: "count", value: 1 },   pointsPerMashup: 2,  completionMultiplier: 2 },
    rare:      { reveal: { type: "ratio", value: 0.25 }, pointsPerMashup: 5,  completionMultiplier: 5 },
    epic:      { reveal: { type: "ratio", value: 0.50 }, pointsPerMashup: 10, completionMultiplier: 10 },
    legendary: { reveal: { type: "ratio", value: 0.75 }, pointsPerMashup: 25, completionMultiplier: 25 },
    mythic:    { reveal: { type: "ratio", value: 1 },    pointsPerMashup: 50, completionMultiplier: 50 }
  },
  collections: []
};
