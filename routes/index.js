const { Router } = require('express');
const { SuccessResponseObject } = require('../common/http');
const deleteShortlink = require('./deleteShortlink.route')
const validUrl = require('valid-url')
const { nanoid } = require('nanoid')
const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')

dotenv.config({ silent: process.env.NODE_ENV === 'production' })

// Supabase .env
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const r = Router();
r.use('/delete', deleteShortlink)

r.get('/', (req, res) => res.redirect('https://kurz.evl.pink'));
r.post('/', async (req, res) => {
  const original_link = req.body.original_link
   if (!validUrl.isUri(original_link)) {
        // URL validation data submit
        res.status(406).send({
          error: true,
          message: 'URL is not valid'
        })
      } else {
        let delete_key = nanoid(6)
        let short_link = nanoid(5)

        const supabase = await createClient(supabaseUrl, supabaseKey)
        await supabase
          .from('kurz_db')
          .insert([{ original_link, short_link, delete_key }])

        res.status(201).send({
          status: 201,
          data: {
            short_link,
            delete_key
          }
        })
      }
})

r.get('/:short', async (req, res) => {
  const supabase = await createClient(supabaseUrl, supabaseKey)
  let { data } = await supabase
    .from('kurz_db')
    .select('original_link')
    .eq('short_link', req.params.short)

  if (data.length > 0) {
    res.status(308)
    res.redirect(data[0].original_link)
  } else {
    res.status(404).send('Shortlink did not created, please create on https://kurz.evl.pink')
  }
});

module.exports = r;
