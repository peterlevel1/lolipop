module.exports = {
  async index(ctx) {
    const query = ctx.query;

    const data = await ctx.service.common.find(ctx.table, {
      ...query,
      status: 1
    });

    ctx.body = { success: true, data };
  },

  async show(ctx) {
    const id = ctx.params.id;

    const data = await ctx.service.common.find(ctx.table, { id, status: 1 });

    ctx.body = { success: true, data };
  },

  async create(ctx) {
    const body = ctx.request.body;

    const data = await ctx.service.common.create(ctx.table, body);

    // 需要返回数据库中真实的 id
    ctx.body = { success: true, data: { id: data.insertId } };
  },

  async update(ctx) {
    const id = ctx.params.id;
    const body = ctx.request.body;
    const condition = { ...body, id };

    await ctx.service.common.update(ctx.table, condition);

    ctx.status = 204;
  },

  async destroy(ctx) {
    const id = ctx.params.id;

    await ctx.service.common.update(ctx.table, { id, status: 0 });

    ctx.status = 204;
  }
}
