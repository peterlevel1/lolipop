module.exports = (appInfo, config) => {

  const ret = {
    // use for cookie sign key, should change to your own and keep security
    keys: appInfo.name + '_1537234294332_6925',

    // add your config here
    middleware: [],
  };

  Object.assign(config, ret);
};
