Legend:
... = Self understood

My device Component uses extensive use of MomentJS library

Working ==>

moment().valueOf() = gives current time stamp in epoch time(millisecons), valueOf() method changes the default UTC time string into UNIX

moment().startOf("day").valueOf() = start of day in UNIX
moment().startOf("week").valueOf() = ...
moment().startOf("month").valueOf() = ...

moment().subtract(1, "days").startOf("day").valueOf() = Subtract 1 day and give UNIX time stamp of the start of that day

IMPORTANT:
isoWeek is used instead of week to set the default starting date of momentJS(Sunday) to Monday

moment().subtract(1, "weeks").startOf("isoWeek").valueOf()
moment().subtract(1, "years").startOf("year").valueOf()
