connection "aws_master" {
  plugin  = "aws"
  profile = "default"
  regions = ["ap-northeast-2"]

  options "connection" {
    cache     = false # true, false
    cache_ttl = 300  # expiration (TTL) in seconds
  }
}

connection "aws_sub1" {
  plugin    = "aws"
  profile   = "sub1"
  regions   = ["ap-northeast-2"]

  options "connection" {
    cache     = false # true, false
    cache_ttl = 300  # expiration (TTL) in seconds
  }
}

connection "aws_all" {
  plugin      = "aws"
  type        = "aggregator"
  connections = ["aws_master", "aws_sub1"]
}