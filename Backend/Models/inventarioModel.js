class InventarioModel{
    constructor(noInventario, descripcion, marca, modelo, serie, departamento, responsable, fechaAdquisicion, valorAdquisicion, estado){
        this.noInventario = noInventario;
        this.descripcion = descripcion;
        this.marca = marca;
        this.modelo = modelo;
        this.serie = serie;
        this.departamento = departamento;
        this.responsable = responsable;
        this.fechaAdquisicion = fechaAdquisicion;
        this.valorAdquisicion = valorAdquisicion;
        this.estado = estado;
    }
}

module.exports = InventarioModel;