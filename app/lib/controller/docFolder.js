exports.table = 'lolipop_api_folder';

exports.rules = {
  index: {
    parentId: {
      type: '@int',
      required: false
    }
  },
  create: {
    title: 'string',
    desc: 'string?',
    parentId: 'int'
  },
  update: {
    title: 'string?',
    desc: 'string?',
    parentId: 'int?'
  },
}

