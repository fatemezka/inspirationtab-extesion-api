const Sequelize = require("sequelize");
const { error_operation } = require("namira-nodejs");

module.exports = class Context
{
    constructor()
    {
        this.database = require("./config/database");
    }

    getColumns(model, secure)
    {
        let ans = [];
        for (const [key, value] of Object.entries(
            model.fieldRawAttributesMap
        ))
        {
            if (secure === true)
            {
                if (value.secure) ans.push(key);
            } else if (secure === false)
            {
                if (!value.secure) ans.push(key);
            } else ans.push(key);
        }
        return ans;
    }

    addFunction(model)
    {
        model.getColumns = (secure) =>
        {
            return this.getColumns(model, secure);
        };
        model.secure = (obj) =>
        {
            let Cs = this.getColumns(model, true);
            for (let i = 0; i < Cs.length; i++)
            {
                const element = Cs[i];
                delete obj.dataValues[element];
            }
            return obj;
        };
        return model;
    }

    init()
    {
        // Tables
        const Favorite = require("./model/Favorite");
        const Image = require("./model/Image");
        const Impression = require("./model/Impression");
        const Link = require("./model/Link");
        const Mantra = require("./model/Mantra");
        const Quote = require("./model/Quote");
        const Search = require("./model/Search");
        const Setting = require("./model/Setting");
        const Todo = require("./model/Todo");
        const User = require("./model/User");

        const favorite = this.addFunction(
            Favorite(this.database, Sequelize.DataTypes)
        );
        const image = this.addFunction(
            Image(this.database, Sequelize.DataTypes)
        );
        const impression = this.addFunction(
            Impression(this.database, Sequelize.DataTypes)
        );
        const link = this.addFunction(Link(this.database, Sequelize.DataTypes));
        const mantra = this.addFunction(
            Mantra(this.database, Sequelize.DataTypes)
        );
        const quote = this.addFunction(
            Quote(this.database, Sequelize.DataTypes)
        );
        const search = this.addFunction(
            Search(this.database, Sequelize.DataTypes)
        );
        const setting = this.addFunction(
            Setting(this.database, Sequelize.DataTypes)
        );
        const todo = this.addFunction(Todo(this.database, Sequelize.DataTypes));
        const user = this.addFunction(User(this.database, Sequelize.DataTypes));

        //set foreignKey
        favorite.belongsTo(user, {
            foreignKey: { name: "user_id", allowNull: false },
        });
        impression.belongsTo(image, {
            foreignKey: { name: "image_id", allowNull: false },
        });
        impression.belongsTo(quote, {
            foreignKey: { name: "quote_id", allowNull: false },
        });
        impression.belongsTo(mantra, {
            foreignKey: { name: "mantra_id", allowNull: false },
        });
        link.belongsTo(user, {
            foreignKey: { name: "user_id", allowNull: false },
        });
        search.belongsTo(user, {
            foreignKey: { name: "user_id", allowNull: false },
        });
        setting.belongsTo(user, {
            foreignKey: { name: "user_id", allowNull: false },
        });
        todo.belongsTo(user, {
            foreignKey: { name: "user_id", allowNull: false },
        });

        this.database.sync({ force: false });
    }

    async getModel(model, user_id, id, options, noErrorOnEmpty)
    {
        if (!options)
            options = {};
        if (!options.where)
            options.where = {};
        if (id)
            options.where.id = id;
        let value = await this.database.models[model].findOne(options);
        if (!value)
            if (noErrorOnEmpty)
                return null;
            else
                error_operation.throwError(404, "Could not found " + model);
        if (user_id && value.user_id != user_id)
            error_operation.throwError(403, "The user is not allowed!");
        return value;
    }

    async deleteModel(model, user_id, id, options)
    {
        let value = await this.getModel(model, user_id, id, options, true);
        if (value)
            return await value.destroy();
        return {};
    }

    //#region Random Image/Quote/Mantra
    async addImpression(quote, image, mantra)
    {
        let quote_id = quote ? quote.id : null;
        let image_id = image ? image.id : null;
        let mantra_id = mantra ? mantra.id : null;
        return await this.database.models.impression.create({
            quote_id,
            image_id,
            mantra_id,
        });
    }

    async getRandom(quote, image, mantra)
    {
        let seed = new Date().getMonth() * 31 + new Date().getDate() + process.env.seed;
        if (quote)
            quote = await this.database.models.quote.findOne({
                order: [Sequelize.fn("RAND", seed)],
            });
        if (image)
            image = await this.database.models.image.findOne({
                order: [Sequelize.fn("RAND", seed)],
            });
        if (mantra)
            mantra = await this.database.models.mantra.findOne({
                order: [Sequelize.fn("RAND", seed)],
            });
        this.addImpression(quote, image, mantra);
        return { quote, image, mantra };
    }
    //#endregion

    //#region Link
    async getLinks(user_id)
    {
        return await this.database.models.link.findAll({ where: { user_id } });
    }

    async addOrUpdateLink(id, user_id, name, logo, url)
    {
        let link = await this.getModel("link", user_id, id, null, true);
        if (link)
        {
            link.name = name;
            link.logo = logo;
            link.url = url;
            return link.save();
        }
        return await this.database.models.link.create({
            user_id,
            name,
            logo,
            url,
        });
    }

    async deleteLink(id, user_id)
    {
        return await this.deleteModel("link", user_id, id);
    }
    //#endregion

    //#region Todo
    async getTodos(user_id)
    {
        return await this.database.models.todo.findAll({ where: { user_id } });
    }

    async getTodo(id, user_id)
    {
        return await this.getModel("todo", user_id, id);
    }

    async deleteTodo(id, user_id)
    {
        return await this.deleteModel("todo", user_id, id);
    }

    async deleteTodos(user_id)
    {
        await this.database.models.todo.destroy({ where: { user_id } });
    }

    async completeTodo(id, user_id, completed)
    {
        let todo = await this.getModel("todo", user_id, id);
        todo.completed = completed;
        return todo.save();
    }

    async addOrUpdateTodo(id, user_id, name, date, list, completed)
    {
        let todo = await this.getModel("todo", user_id, id, null, true);
        if (!completed) completed = false;
        if (todo)
        {
            todo.name = name;
            todo.date = date;
            todo.list = list;
            todo.completed = completed;
            return await todo.save();
        }
        return await this.database.models.todo.create({
            user_id,
            name,
            date,
            list,
            completed,
        });
    }
    //#endregion

    //#region User
    async getUser(id, secure)
    {
        let attributes;
        if (secure)
            attributes.exclude = this.database.models.game.getColumns(true);
        return await this.database.models.user.findOne({
            where: {
                id,
            },
            attributes,
        });
    }

    async getUserByEmail(email)
    {
        return await this.database.models.user.findOne({
            where: {
                email,
            },
        });
    }

    async getOrAddUser(name, email, password, newsletter)
    {
        let user = await this.getUserByEmail(email);
        if (!user)
        {
            if (!newsletter) newsletter = false;
            user = await this.database.models.user.create({
                name,
                email,
                password,
                newsletter,
            });
        }
        return user;
    }

    async isEmailExist(email)
    {
        let user = await this.getUserByEmail(email);
        if (user) return true;
        return false;
    }

    async editUser(user)
    {
        return await user.save();
    }
    //#endregion

    //#region Favorite
    async getFavorites(user_id)
    {
        return await this.database.models.favorite.findAll({
            where: { user_id },
        });
    }

    async addOrUpdateFavorite(id, user_id, url)
    {
        let favorite = await this.getModel("favorite", user_id, id, null, true);
        if (favorite)
        {
            favorite.url = url;
            return await favorite.save();
        }
        return await this.database.models.favorite.create({
            user_id,
            url,
        });
    }

    async deleteFavorite(id, user_id)
    {
        return await this.deleteModel("favorite", user_id, id);
    }
    //#endregion

    //#region Search
    async addSearch(user_id, query, ip)
    {
        return await this.database.models.search.create({
            user_id,
            query,
            ip
        });
    }
    //#endregion

    //#region Setting
    async getSettings(user_id)
    {
        return await this.database.models.setting.findAll({
            where: { user_id },
        });
    }

    async addOrUpdateSettings(id, user_id, name, value)
    {
        let setting = await this.getModel("setting", user_id, id, null, true);
        if (!setting)
            setting = await this.getModel("setting", user_id, null, { where: { user_id, name } }, true);
        if (setting)
        {
            setting.name = name;
            setting.value = value;
            return await setting.save();
        }
        return await this.database.models.setting.create({
            user_id,
            name,
            value,
        });
    }

    async deleteSetting(id, user_id)
    {
        return await this.deleteModel("setting", user_id, id);
    }
    //#endregion
};
