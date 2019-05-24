/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const pz = sequelize.define('projektniZadatak_clanGrupe', {
    idProjektniZadatak: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'ProjektniZadatak',
        key: 'idprojektnogzadatka'
      }
    },
    idClanGrupe: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'ClanGrupe',
        key: 'idclangrupe'
      }
    }
  }, {
    tableName: 'projektniZadatak_clanGrupe'
  })
  pz.removeAttribute('id');
  return pz;
};
