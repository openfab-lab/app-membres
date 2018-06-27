module.exports.attachFindByIds = Model => async ids => {
  return Model.findAll({
    where: {
      id: {
        $in: ids
      }
    }
  });
};

module.exports.attachDeleteByIds = Model => async ids => {
  return Model.destroy({
    where: {
      id: {
        $in: ids
      }
    }
  });
};

module.exports.attachUpdateByIds = Model => async (data, ids) => {
  const updatedData = await Model.update(
    data,
    {
      where: {
        id: {
          $in: ids
        }
      },
      returning: true
    }
  );
  return updatedData[1];
};

module.exports.attachDeleteByField = (Model, item) => async ids => {
  return Model.destroy({
    where: {
      [item]: {
        $in: ids
      }
    }
  });
};

module.exports.attachFindByField = (Model, item) => async ids => {
  return Model.findAll({
    where: {
      [item]: {
        $in: ids
      }
    }
  });
};

module.exports.getIds = array => array.map(item => item.id);

module.exports.getJsons = array => array.map(item => item.toJSON());
