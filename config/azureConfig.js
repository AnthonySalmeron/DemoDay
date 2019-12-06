module.exports = {
  connectionString: 'DefaultEndpointsProtocol=https;AccountName=sciencedoc;AccountKey=itZA4M7dQWVdWtbUOL7vgExmZi0rewtbmBhNOqwTpFi5v4ruyeiOfYGvJx4XWqJguepLOHrQ5K2Rqt6GkHPWgg==;EndpointSuffix=core.windows.net', //Connection String for azure storage account, this one is prefered if you specified, fallback to account and key if not.
  account: 'sciencedoc', //The name of the Azure storage account
  key: 'itZA4M7dQWVdWtbUOL7vgExmZi0rewtbmBhNOqwTpFi5v4ruyeiOfYGvJx4XWqJguepLOHrQ5K2Rqt6GkHPWgg==', //A key listed under Access keys in the storage account pane
  container: 'science',
  subscription_key: '0287c961fd7348a39433d630fcd2a240',// for ML
  endpoint: 'https://reviewsentiment.cognitiveservices.azure.com/'
}
