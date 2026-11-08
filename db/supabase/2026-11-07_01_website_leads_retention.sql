-- Quarterly clean-up of old website leads (PIPEDA: keep personal information
-- only as long as needed). Run by hand in the Supabase SQL editor AT LEAST every
-- 3 months (the privacy policy promises this). Delete the matching Gmail
-- notification emails at the same time. No scheduler/extension is used, so nothing changes in the app's DB.
--
-- Rules:
--   * spam ............................ deleted 30 days after it arrived
--   * new / quoted / lost (no job) .... deleted 12 months after last update
--   * booked / completed .............. deleted 36 months after last update
--     (covers CASL's 3-year window for proof of consent; the job itself
--      lives on as a transaction in the KeyFoby app)
--
-- STEP 1: preview what would be deleted (changes nothing):
select status, count(*) as rows_to_delete
from website.leads
where (status = 'spam' and created_at < now() - interval '30 days')
   or (status in ('new', 'quoted', 'lost') and updated_at < now() - interval '12 months')
   or (status in ('booked', 'completed') and updated_at < now() - interval '36 months')
group by status
order by status;

-- STEP 2: if the numbers look right, select and run ONLY these lines:
-- delete from website.leads
-- where (status = 'spam' and created_at < now() - interval '30 days')
--    or (status in ('new', 'quoted', 'lost') and updated_at < now() - interval '12 months')
--    or (status in ('booked', 'completed') and updated_at < now() - interval '36 months');
